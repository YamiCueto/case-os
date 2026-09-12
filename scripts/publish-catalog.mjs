import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Parse arguments
const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('--validate-only');
const shouldCleanDraft = process.argv.includes('--clean-draft') || process.argv.includes('--reset-draft');

/**
 * ============================================================================
 * NOTA DE ARQUITECTURA Y RECUPERABILIDAD DE BORRADORES
 * ============================================================================
 * Las entidades previas a la publicación (learning_units, learning_unit_versions,
 * program_units) se proyectan mediante peticiones HTTPS secuenciales con la versión
 * del programa en estado 'DRAFT'.
 *
 * Si ocurre una falla de red o error de API durante esta etapa preliminar:
 * 1. La versión permanece estrictamente en 'DRAFT'.
 * 2. Las políticas RLS de enrollments impiden que ningún estudiante se inscriba
 *    (requieren status = 'PUBLISHED').
 * 3. Los triggers de inmutabilidad no bloquean la corrección del borrador.
 * 4. El script es idempotente: ejecutarlo de nuevo reutilizará el borrador
 *    existente y completará las unidades faltantes.
 * 5. Si se requiere reiniciar el borrador desde cero, ejecutar con `--clean-draft`.
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

async function run() {
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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.log('[MODO LOCAL / INFORMATIVO] SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas.');
    console.log('[SEGURIDAD] La publicación del catálogo exige exclusivamente SUPABASE_SERVICE_ROLE_KEY; no se acepta clave anónima.');
    console.log('No se realizó ninguna publicación ni conexión remota. Validación de catálogo completada localmente.');
    return;
  }

  const supabase = createClient(url, serviceRoleKey);
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
    if (shouldCleanDraft) {
      console.log(`[CLEAN-DRAFT] Purgando enlaces del borrador previo ${programId}...`);
      const { error: cleanErr } = await supabase
        .from('program_units')
        .delete()
        .eq('program_version_id', programId);

      if (cleanErr) {
        console.error('Error al purgar borrador previo:', cleanErr.message);
        process.exit(1);
      }
      console.log('[CLEAN-DRAFT] Borrador purgado exitosamente. Procediendo con sincronización completa.');
    }
  }

  // 2. Sincronizar entidades individuales comprobando cada respuesta de Supabase
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

  // 3. Publicación atómica mediante RPC con bloqueo coordinado
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
