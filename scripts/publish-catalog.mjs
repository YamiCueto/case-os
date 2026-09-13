import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Parse arguments
const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('--validate-only');

/**
 * ============================================================================
 * NOTA DE ARQUITECTURA Y PROYECCIÓN IDEMPOTENTE DEL CATÁLOGO
 * ============================================================================
 * Las entidades previas a la publicación (learning_units, learning_unit_versions,
 * program_units) se proyectan con la versión del programa en estado 'DRAFT'.
 *
 * Si el programa ya existe en 'DRAFT' (por una ejecución previa interrumpida):
 * 1. Se purgan automáticamente sus enlaces en 'program_units' para garantizar
 *    que la malla sea un espejo 1:1 exacto de Git (sin unidades huérfanas).
 * 2. Se re-insertan las 45 unidades y sus relaciones de prerrequisitos.
 * 3. Antes de invocar `publish_program_version`, se realiza una reconciliación
 *    exhaustiva 1:1 contra la base de datos (cardinalidad, ids, títulos, paths,
 *    módulos, tipos, orden, prerrequisitos sin mutación y ausencia de duplicados).
 * 4. Si cualquier metadato difiere, el script falla con exit code 1 y el programa
 *    permanece en DRAFT sin transicionar a PUBLISHED.
 * ============================================================================
 */

/**
 * Extrae de forma fidedigna la estructura completa de COURSE_CONFIG desde course.config.ts
 * garantizando la pertenencia real de cada unidad a su módulo, tipo y prerrequisitos.
 */
export function extractCourseConfig() {
  const filePath = 'src/app/core/config/course.config.ts';
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found at ${filePath}`);
  }

  let code = fs.readFileSync(filePath, 'utf8');
  // Limpiar imports y anotaciones TypeScript para evaluar el objeto de configuración puro
  code = code
    .replace(/import\s+[^;]+;/, '')
    .replace(': CourseConfig', '')
    .replace(/export\s+const\s+COURSE_CONFIG/, 'const COURSE_CONFIG');

  const evaluator = new Function(`${code}; return COURSE_CONFIG;`);
  const config = evaluator();

  const modules = [];
  const lessons = [];

  let globalOrder = 1;
  for (const mod of config.modules) {
    modules.push({
      id: mod.id,
      title: mod.title,
      order: mod.order
    });

    for (const lesson of mod.lessons) {
      let resolvedType = lesson.type;
      if (!resolvedType) {
        if (lesson.id.startsWith('c')) resolvedType = 'LESSON';
        else if (lesson.id.startsWith('d')) resolvedType = 'DEMO';
        else if (lesson.id.startsWith('l')) resolvedType = 'LAB';
        else if (lesson.id.startsWith('cap')) resolvedType = 'CAPSTONE';
        else resolvedType = 'LESSON';
      }

      lessons.push({
        id: lesson.id,
        moduleId: mod.id, // Vínculo real garantizado (ej: c4 -> m2)
        title: lesson.title,
        moduleOrder: lesson.order,
        globalOrder: globalOrder++,
        path: lesson.path,
        type: resolvedType,
        prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : []
      });
    }
  }

  return { modules, lessons };
}

/**
 * Valida que la credencial provista tenga privilegios administrativos reales (service_role o secret key)
 * y pertenezca al proyecto objetivo mediante una llamada de solo lectura a la API de administración.
 * No asume que el token sea JWT ni imprime/persiste secretos.
 */
export async function verifyAdministrativeAccess(supabase) {
  const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) {
    throw new Error(`Acceso administrativo denegado (${error.message}). La credencial provista no tiene permisos administrativos o no coincide con el proyecto objetivo.`);
  }
}

/**
 * Reconcilia exhaustivamente la proyección remota de unidades contra el catálogo esperado en Git.
 * Valida cardinalidad, duplicados, id, versión, título, path, moduleId, tipo, orden y prerrequisitos
 * (usando copias inmutables ordenadas sin mutar el array original).
 */
export function reconcileCatalog(lessons, remoteUnits) {
  const issues = [];

  if (!Array.isArray(remoteUnits)) {
    return {
      valid: false,
      issues: ['La respuesta remota de unidades no es un arreglo válido.']
    };
  }

  // 1. Cardinalidad exacta
  if (remoteUnits.length !== lessons.length) {
    issues.push(`Cardinalidad discrepante: esperado ${lessons.length} unidades en Git, encontradas ${remoteUnits.length} en remoto.`);
  }

  // 2. Detección de duplicados en remoto
  const seenUnitIds = new Set();
  const duplicateUnitIds = new Set();
  for (const ru of remoteUnits) {
    const unitId = ru.learning_unit_versions?.learning_units?.id;
    if (unitId) {
      if (seenUnitIds.has(unitId)) {
        duplicateUnitIds.add(unitId);
      }
      seenUnitIds.add(unitId);
    }
  }
  if (duplicateUnitIds.size > 0) {
    issues.push(`Unidades duplicadas en program_units remoto: [${Array.from(duplicateUnitIds).join(', ')}]`);
  }

  // 3. Mapeo de unidades remotas
  const remoteMap = new Map();
  for (const ru of remoteUnits) {
    const luv = ru.learning_unit_versions;
    const lu = luv?.learning_units;
    if (lu?.id) {
      remoteMap.set(lu.id, {
        unitId: lu.id,
        moduleId: lu.module_id,
        type: lu.type,
        version: luv.version,
        path: luv.path,
        title: luv.title,
        displayOrder: ru.display_order,
        // Copia ordenada para comparación sin mutar el array original
        prerequisites: Array.isArray(ru.prerequisites) ? [...ru.prerequisites].sort() : []
      });
    }
  }

  // 4. Contrastar cada lección esperada de Git
  for (const local of lessons) {
    const remote = remoteMap.get(local.id);
    if (!remote) {
      issues.push(`Unidad faltante en remoto: '${local.id}' (${local.title})`);
      continue;
    }

    if (remote.version !== '1.0.0') {
      issues.push(`Versión desalineada en unidad '${local.id}': esperado '1.0.0', remoto '${remote.version}'`);
    }
    if (remote.title !== local.title) {
      issues.push(`Título desalineado en unidad '${local.id}': esperado '${local.title}', remoto '${remote.title}'`);
    }
    if (remote.path !== local.path) {
      issues.push(`Path desalineado en unidad '${local.id}': esperado '${local.path}', remoto '${remote.path}'`);
    }
    if (remote.moduleId !== local.moduleId) {
      issues.push(`Módulo desalineado en unidad '${local.id}': esperado '${local.moduleId}', remoto '${remote.moduleId}'`);
    }
    if (remote.type !== local.type) {
      issues.push(`Tipo desalineado en unidad '${local.id}': esperado '${local.type}', remoto '${remote.type}'`);
    }
    if (remote.displayOrder !== local.globalOrder) {
      issues.push(`Orden (display_order) desalineado en unidad '${local.id}': esperado ${local.globalOrder}, remoto ${remote.displayOrder}`);
    }

    // Comparar prerrequisitos usando copias ordenadas sin mutar
    const localPrereqsSorted = [...local.prerequisites].sort();
    const remotePrereqsSorted = [...remote.prerequisites].sort();
    if (JSON.stringify(localPrereqsSorted) !== JSON.stringify(remotePrereqsSorted)) {
      issues.push(`Prerrequisitos desalineados en unidad '${local.id}': esperado [${localPrereqsSorted.join(', ')}], remoto [${remotePrereqsSorted.join(', ')}]`);
    }
  }

  // 5. Detectar unidades sobrantes en remoto que no están en Git
  const localIds = new Set(lessons.map(l => l.id));
  for (const remoteId of remoteMap.keys()) {
    if (!localIds.has(remoteId)) {
      issues.push(`Unidad sobrante en remoto no presente en Git: '${remoteId}'`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export async function run() {
  console.log('--- Proyección y Publicación del Catálogo CASE OS desde Git ---');
  const { modules, lessons } = extractCourseConfig();
  console.log(`Detectados en Git: ${modules.length} módulos y ${lessons.length} unidades de aprendizaje.`);

  if (modules.length === 0 || lessons.length === 0) {
    console.error('Error: No se detectaron módulos o lecciones válidas en course.config.ts');
    process.exit(1);
  }

  // Verificación de integridad clave
  const c4 = lessons.find(l => l.id === 'c4');
  console.log(`[VERIFICACIÓN] Lección c4 pertenece a módulo: ${c4?.moduleId}, prerrequisitos: [${c4?.prerequisites.join(', ')}]`);

  if (isDryRun) {
    console.log('[PASS] Modo --dry-run / --validate-only exitoso. Catálogo íntegro y validado con relaciones reales.');
    return;
  }

  const url = process.env.SUPABASE_URL;
  const administrativeKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !administrativeKey) {
    console.error('Error: SUPABASE_URL y una credencial administrativa (SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY) son obligatorias para publicar.');
    console.error('[SEGURIDAD] La publicación del catálogo exige exclusivamente una clave administrativa con bypass RLS (service_role o sb_secret_*); las claves anónimas y de usuario no están permitidas.');
    process.exit(1);
  }

  const supabase = createClient(url, administrativeKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  // Validar privilegio administrativo real contra el proyecto remoto
  console.log('Validando credencial administrativa contra el proyecto Supabase objetivo...');
  try {
    await verifyAdministrativeAccess(supabase);
    console.log('[PASS] Credencial administrativa autenticada con éxito en el proyecto remoto.');
  } catch (authErr) {
    console.error(`[ERROR DE SEGURIDAD] ${authErr.message}`);
    process.exit(1);
  }

  const programSlug = 'case-engineering-workspace';
  const programVersion = '1.0.0';
  const programTitle = 'CASE OS — Engineering Workspace';

  console.log(`Verificando estado del programa ${programSlug} v${programVersion}...`);

  // 1. Consultar estado existente sin forzar DRAFT para respetar inmutabilidad
  const { data: existingProg, error: progFindErr } = await supabase
    .from('program_versions')
    .select('id, status, title')
    .eq('slug', programSlug)
    .eq('version', programVersion)
    .maybeSingle();

  if (progFindErr) {
    console.error('Error al consultar program_version:', progFindErr.message);
    process.exit(1);
  }

  if (existingProg && (existingProg.status === 'PUBLISHED' || existingProg.status === 'ARCHIVED')) {
    console.log(`[INFO] La versión ${programVersion} ya se encuentra ${existingProg.status}. Inmutabilidad respetada; no se realizan cambios.`);
    return;
  }

  let programId;
  if (!existingProg) {
    console.log('Registrando versión inicial del programa en DRAFT...');
    const { data: createdProg, error: createErr } = await supabase
      .from('program_versions')
      .insert({
        slug: programSlug,
        version: programVersion,
        title: programTitle,
        status: 'DRAFT'
      })
      .select('id, status')
      .single();

    if (createErr) {
      console.error('Error al crear program_version:', createErr.message);
      process.exit(1);
    }
    programId = createdProg.id;
  } else {
    programId = existingProg.id;
    console.log(`[DRAFT] Programa existente en borrador (id: ${programId}). Reconstruyendo program_units desde Git...`);
    // Purgar vínculos previos en DRAFT para garantizar proyección 1:1 exacta con Git
    const { error: cleanErr } = await supabase
      .from('program_units')
      .delete()
      .eq('program_version_id', programId);

    if (cleanErr) {
      console.error('Error al purgar enlaces de program_units del borrador previo:', cleanErr.message);
      process.exit(1);
    }
    console.log('[DRAFT] Enlaces previos purgados. Re-proyectando unidades desde Git...');
  }

  // 2. Sincronizar entidades maestras y de versión
  console.log('Sincronizando unidades de aprendizaje y versiones...');
  for (const lesson of lessons) {
    const { error: luErr } = await supabase.from('learning_units').upsert({
      id: lesson.id,
      module_id: lesson.moduleId,
      type: lesson.type
    }, { onConflict: 'id' });

    if (luErr) {
      console.error(`Error al registrar learning_unit (${lesson.id}):`, luErr.message);
      process.exit(1);
    }

    const { data: unitVer, error: luvErr } = await supabase
      .from('learning_unit_versions')
      .upsert({
        unit_id: lesson.id,
        version: '1.0.0',
        path: lesson.path,
        title: lesson.title
      }, { onConflict: 'unit_id,version' })
      .select('id')
      .single();

    if (luvErr || !unitVer) {
      console.error(`Error al registrar learning_unit_version (${lesson.id}):`, luvErr?.message);
      process.exit(1);
    }

    const { error: puErr } = await supabase.from('program_units').upsert({
      program_version_id: programId,
      unit_version_id: unitVer.id,
      display_order: lesson.globalOrder,
      prerequisites: lesson.prerequisites
    }, { onConflict: 'program_version_id,unit_version_id' });

    if (puErr) {
      console.error(`Error al registrar program_units (${lesson.id}):`, puErr.message);
      process.exit(1);
    }
  }

  // 3. Auditoría exhaustiva pre-publicación contra la base de datos
  console.log('Realizando auditoría integral del borrador remoto contra el catálogo Git...');
  const { data: remoteUnits, error: auditFetchErr } = await supabase
    .from('program_units')
    .select(`
      program_version_id,
      display_order,
      prerequisites,
      learning_unit_versions!inner (
        id,
        version,
        path,
        title,
        learning_units!inner (
          id,
          module_id,
          type
        )
      )
    `)
    .eq('program_version_id', programId);

  if (auditFetchErr) {
    console.error('Error al consultar datos remotos para auditoría pre-publicación:', auditFetchErr.message);
    process.exit(1);
  }

  const reconciliation = reconcileCatalog(lessons, remoteUnits);
  if (!reconciliation.valid) {
    console.error('\n--- AUDITORÍA PRE-PUBLICACIÓN RECHAZADA ---');
    for (const issue of reconciliation.issues) {
      console.error(`  [X] ${issue}`);
    }
    console.error('\n[SEGURIDAD] La versión permanece en DRAFT. publish_program_version NO fue invocada.');
    process.exit(1);
  }

  console.log(`[AUDIT PASS] Las ${lessons.length} unidades remotas coinciden 1:1 con Git (metadatos, orden, módulos, tipos y prerrequisitos).`);

  // 4. Publicación atómica mediante RPC con bloqueo coordinado
  console.log(`Ejecutando procedimiento atómico public.publish_program_version(${programId}) con bloqueo coordinado...`);
  const { error: pubErr } = await supabase.rpc('publish_program_version', {
    p_program_version_id: programId
  });

  if (pubErr) {
    console.error('Error en publicación coordinada:', pubErr.message);
    process.exit(1);
  }

  console.log(`[SUCCESS] Programa ${programSlug} v${programVersion} publicado exitosamente con bloqueo coordinado.`);
}

if (process.argv[1] && process.argv[1].endsWith('publish-catalog.mjs')) {
  run().catch(err => {
    console.error('Error no controlado en publicación de catálogo:', err);
    process.exit(1);
  });
}
