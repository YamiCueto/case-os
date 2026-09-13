import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  extractCourseConfig,
  reconcileCatalog,
  verifyAdministrativeAccess
} from '../scripts/publish-catalog.mjs';

console.log('=== Suite de Pruebas: Hardening de Publicación de Catálogo ===\n');

// ---------------------------------------------------------------------------
// 1. Prueba: Credenciales ausentes (Fail-Fast con exit code 1)
// ---------------------------------------------------------------------------
console.log('1. Verificando Fail-Fast ante credenciales ausentes...');
const runWithoutCreds = spawnSync('node', ['scripts/publish-catalog.mjs'], {
  env: { ...process.env, SUPABASE_URL: '', SUPABASE_SERVICE_ROLE_KEY: '', SUPABASE_SECRET_KEY: '' },
  encoding: 'utf8'
});
assert.equal(
  runWithoutCreds.status,
  1,
  `Debe salir con código 1 cuando faltan credenciales, pero obtuvo ${runWithoutCreds.status}`
);
assert.match(
  runWithoutCreds.stderr,
  /Error: SUPABASE_URL y una credencial administrativa/,
  'Debe imprimir mensaje descriptivo de falta de credenciales'
);
console.log('[PASS] 1. Fail-fast comprobado ante credenciales ausentes.\n');

// ---------------------------------------------------------------------------
// 2. Prueba: Clave no administrativa (rechazo vía verifyAdministrativeAccess)
// ---------------------------------------------------------------------------
console.log('2. Verificando validación de credencial administrativa (sin asumir JWT)...');
// Simulación A: Cliente mock donde auth.admin.listUsers falla (clave anon o sin permisos)
const mockNonAdminClient = {
  auth: {
    admin: {
      listUsers: async () => ({
        data: null,
        error: { message: 'User not allowed or invalid administrative key' }
      })
    }
  }
};

await assert.rejects(
  async () => {
    await verifyAdministrativeAccess(mockNonAdminClient);
  },
  /Acceso administrativo denegado/,
  'Debe rechazar credenciales no administrativas o no autorizadas'
);

// Simulación B: Cliente mock con credencial administrativa válida
const mockAdminClient = {
  auth: {
    admin: {
      listUsers: async () => ({
        data: { users: [] },
        error: null
      })
    }
  }
};

await assert.doesNotReject(
  async () => {
    await verifyAdministrativeAccess(mockAdminClient);
  },
  'Debe aceptar credenciales administrativas válidas'
);
console.log('[PASS] 2. Validación de credencial administrativa completada (tanto legacy como secret key).\n');

// ---------------------------------------------------------------------------
// Preparación de datos base para pruebas de reconciliación
// ---------------------------------------------------------------------------
const { lessons } = extractCourseConfig();
assert.equal(lessons.length, 45, 'Deben existir exactamente 45 lecciones en Git');

function createMockRemoteUnits(lessonsList) {
  return lessonsList.map(l => ({
    program_version_id: 'prog-123',
    display_order: l.globalOrder,
    // Usar copia de prerrequisitos
    prerequisites: [...l.prerequisites],
    learning_unit_versions: {
      id: `${l.id}-v1`,
      version: '1.0.0',
      path: l.path,
      title: l.title,
      learning_units: {
        id: l.id,
        module_id: l.moduleId,
        type: l.type
      }
    }
  }));
}

// ---------------------------------------------------------------------------
// 3. Prueba: DRAFT con unidad sobrante
// ---------------------------------------------------------------------------
console.log('3. Verificando detección de DRAFT con unidad sobrante (zombie / huérfana)...');
const remoteWithExtra = createMockRemoteUnits(lessons);
remoteWithExtra.push({
  program_version_id: 'prog-123',
  display_order: 46,
  prerequisites: [],
  learning_unit_versions: {
    id: 'zombie-unit-v1',
    version: '1.0.0',
    path: 'zombie',
    title: 'Unidad Zombie',
    learning_units: {
      id: 'zombie_unit',
      module_id: 'm1',
      type: 'LESSON'
    }
  }
});

const resExtra = reconcileCatalog(lessons, remoteWithExtra);
assert.equal(resExtra.valid, false, 'No debe validar si hay unidades sobrantes');
assert.ok(
  resExtra.issues.some(i => i.includes("Unidad sobrante en remoto")),
  'Debe reportar la unidad sobrante'
);
assert.ok(
  resExtra.issues.some(i => i.includes("Cardinalidad discrepante")),
  'Debe reportar discrepancia de cardinalidad'
);
console.log('[PASS] 3. Unidad sobrante en DRAFT detectada y bloqueada.\n');

// ---------------------------------------------------------------------------
// 4. Prueba: DRAFT con unidad faltante
// ---------------------------------------------------------------------------
console.log('4. Verificando detección de DRAFT con unidad faltante...');
// Omitir la lección 'c4'
const remoteMissingC4 = createMockRemoteUnits(lessons.filter(l => l.id !== 'c4'));

const resMissing = reconcileCatalog(lessons, remoteMissingC4);
assert.equal(resMissing.valid, false, 'No debe validar si faltan unidades');
assert.ok(
  resMissing.issues.some(i => i.includes("Unidad faltante en remoto: 'c4'")),
  'Debe identificar exactamente la unidad faltante c4'
);
assert.ok(
  resMissing.issues.some(i => i.includes("Cardinalidad discrepante")),
  'Debe reportar discrepancia de cardinalidad'
);
console.log('[PASS] 4. Unidad faltante en DRAFT detectada y bloqueada.\n');

// ---------------------------------------------------------------------------
// 5. Prueba: Metadato desalineado (módulo, orden, tipo, prerrequisitos, duplicados)
// ---------------------------------------------------------------------------
console.log('5. Verificando detección de metadatos desalineados y arrays inmutables...');
// Desalinear módulo en c4
const remoteBadModule = createMockRemoteUnits(lessons);
const c4Unit = remoteBadModule.find(ru => ru.learning_unit_versions.learning_units.id === 'c4');
c4Unit.learning_unit_versions.learning_units.module_id = 'modulo_incorrecto';

const resBadModule = reconcileCatalog(lessons, remoteBadModule);
assert.equal(resBadModule.valid, false);
assert.ok(
  resBadModule.issues.some(i => i.includes("Módulo desalineado en unidad 'c4'")),
  'Debe detectar módulo desalineado'
);

// Desalinear prerrequisitos en c4
const remoteBadPrereqs = createMockRemoteUnits(lessons);
const c4Prereqs = remoteBadPrereqs.find(ru => ru.learning_unit_versions.learning_units.id === 'c4');
c4Prereqs.prerequisites = ['prerequisito_fantasma'];

// Verificar que el array original de la lección NO es mutado
const originalPrereqs = [...lessons.find(l => l.id === 'c4').prerequisites];
const resBadPrereqs = reconcileCatalog(lessons, remoteBadPrereqs);
assert.equal(resBadPrereqs.valid, false);
assert.ok(
  resBadPrereqs.issues.some(i => i.includes("Prerrequisitos desalineados en unidad 'c4'")),
  'Debe detectar prerrequisitos desalineados'
);
assert.deepEqual(
  lessons.find(l => l.id === 'c4').prerequisites,
  originalPrereqs,
  'reconcileCatalog no debe mutar los prerrequisitos originales de lessons'
);

// Duplicados en remoto
const remoteWithDupe = createMockRemoteUnits(lessons);
remoteWithDupe[1] = { ...remoteWithDupe[0] }; // Duplicar primer elemento
const resDupe = reconcileCatalog(lessons, remoteWithDupe);
assert.equal(resDupe.valid, false);
assert.ok(
  resDupe.issues.some(i => i.includes("Unidades duplicadas en program_units")),
  'Debe detectar unidades duplicadas'
);

console.log('[PASS] 5. Metadatos desalineados, duplicados e inmutabilidad de arrays verificados.\n');

// ---------------------------------------------------------------------------
// 6. Prueba: Catálogo exacto -> permite llegar al publish gate
// ---------------------------------------------------------------------------
console.log('6. Verificando catálogo 1:1 exacto (45 unidades idénticas a Git)...');
const remotePerfect = createMockRemoteUnits(lessons);
const resPerfect = reconcileCatalog(lessons, remotePerfect);
assert.equal(resPerfect.valid, true, 'Debe validar exitosamente cuando el catálogo es idéntico');
assert.equal(resPerfect.issues.length, 0, 'No debe registrar ningún issue');
console.log('[PASS] 6. Catálogo exacto aprobado para proceder con publish_program_version.\n');

console.log('=== Todas las 6 pruebas de hardening de catálogo pasaron exitosamente ===');
