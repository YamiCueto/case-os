import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import '@angular/compiler';
import ts from 'typescript';
import { Injector, runInInjectionContext, ɵChangeDetectionScheduler, ɵEffectScheduler } from '@angular/core';
import { extractCourseConfig } from '../scripts/publish-catalog.mjs';

const require = createRequire(import.meta.url);

console.log('=== Suite de Pruebas Reales de Servicios — CASE OS Fase 1 ===\n');

// -----------------------------------------------------------------------------
// 0. Loader en memoria para compilar e importar los servicios reales de Angular
// -----------------------------------------------------------------------------
const moduleCache = new Map();

function loadAngularService(relPath, baseDir = process.cwd()) {
  const fullPath = path.resolve(baseDir, relPath.endsWith('.ts') ? relPath : `${relPath}.ts`);
  if (moduleCache.has(fullPath)) {
    return moduleCache.get(fullPath);
  }

  const rawCode = fs.readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(rawCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      experimentalDecorators: true,
      emitDecoratorMetadata: false
    }
  });

  const moduleObj = { exports: {} };
  moduleCache.set(fullPath, moduleObj.exports);

  const customRequire = (importPath) => {
    if (importPath.startsWith('.')) {
      return loadAngularService(importPath, path.dirname(fullPath));
    }
    return require(importPath);
  };

  const runner = new Function('require', 'exports', 'module', transpiled.outputText);
  runner(customRequire, moduleObj.exports, moduleObj);

  moduleCache.set(fullPath, moduleObj.exports);
  return moduleObj.exports;
}

// Cargar las clases reales del proyecto
const { LocalStorageProvider } = loadAngularService('src/app/core/storage/local-storage.provider.ts');
const { StorageNamespaceService } = loadAngularService('src/app/core/services/storage-namespace.service.ts');
const { CourseService } = loadAngularService('src/app/core/services/course.service.ts');
const { EnrollmentService } = loadAngularService('src/app/core/services/enrollment.service.ts');
const { GuestClaimService } = loadAngularService('src/app/core/services/guest-claim.service.ts');
const { SyncQueueService } = loadAngularService('src/app/core/services/sync-queue.service.ts');
const { UserProgressService } = loadAngularService('src/app/core/services/user-progress.service.ts');
const { UserPreferencesService } = loadAngularService('src/app/core/services/user-preferences.service.ts');
const { SupabaseService } = loadAngularService('src/app/core/services/supabase.service.ts');

// Mock in-memory LocalStorage
function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
    key: (index) => Array.from(map.keys())[index] || null,
    get length() {
      return map.size;
    },
    _rawMap: map
  };
}

let totalTests = 0;
let passedTests = 0;

async function testCase(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// -----------------------------------------------------------------------------
// Test 1: Instanciación y ejecución real de EnrollmentService
// -----------------------------------------------------------------------------
await testCase('1. EnrollmentService: Auto-inscripción de usuario nuevo en programa publicado', async () => {
  let createdEnrollment = null;
  const mockClient = {
    from: (table) => ({
      select: (fields, options) => ({
        eq: (col1, val1) => ({
          eq: (col2, val2) => ({
            eq: (col3, val3) => ({
              maybeSingle: async () => {
                if (table === 'program_versions') {
                  return { data: { id: 'prog-v1-uuid' }, error: null };
                }
                if (table === 'enrollments') {
                  // No existe todavía -> usuario nuevo
                  return { data: null, error: null };
                }
                return { data: null, error: null };
              }
            }),
            maybeSingle: async () => {
              if (table === 'program_versions') {
                return { data: { id: 'prog-v1-uuid' }, error: null };
              }
              return { data: null, error: null };
            }
          }),
          maybeSingle: async () => ({ data: null, error: null })
        }),
        head: true,
        count: 'exact',
        maybeSingle: async () => ({ data: null, error: null })
      }),
      insert: (payload) => ({
        select: () => ({
          single: async () => {
            createdEnrollment = { id: 'enroll-auto-123', ...payload };
            return { data: createdEnrollment, error: null };
          }
        })
      })
    })
  };

  const mockSupabase = {
    client: mockClient,
    currentAuthGeneration: () => 1
  };

  const injector = Injector.create({
    providers: [
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: CourseService, useClass: CourseService },
      { provide: EnrollmentService, useClass: EnrollmentService }
    ]
  });

  const enrollmentService = runInInjectionContext(injector, () => injector.get(EnrollmentService));
  assert.ok(enrollmentService instanceof EnrollmentService, 'Debe ser instancia real de EnrollmentService');

  const result = await enrollmentService.ensureActiveEnrollment('new_user_456', 1);

  assert.ok(result, 'Debe devolver información de inscripción');
  assert.strictEqual(result.enrollmentId, 'enroll-auto-123');
  assert.strictEqual(result.programVersionId, 'prog-v1-uuid');
  assert.ok(createdEnrollment, 'Debe haber ejecutado insert');
  assert.strictEqual(createdEnrollment.user_id, 'new_user_456');
  assert.strictEqual(createdEnrollment.status, 'ACTIVE');
});

// -----------------------------------------------------------------------------
// Test 2: Instanciación y ejecución real de GuestClaimService
// -----------------------------------------------------------------------------
await testCase('2. GuestClaimService: Lecciones inexistentes o fallidas se conservan intactas en guest storage', async () => {
  const mockStorage = createMockLocalStorage();
  global.localStorage = mockStorage;

  // Cargar datos de invitado previos: c1 (válida) y unit_missing_999 (inexistente)
  mockStorage.setItem('case_guest:completed_lessons', JSON.stringify(['c1', 'unit_missing_999']));

  let persistedProgress = [];

  const mockClient = {
    from: (table) => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { id: 'prog-v1-uuid' }, error: null })
            })
          })
        })
      }),
      upsert: async (payload) => {
        persistedProgress.push(payload);
        return { error: null };
      }
    })
  };

  const mockSupabase = {
    client: mockClient,
    currentUser: () => ({ id: 'user_claim_test' }),
    isAuthenticated: () => true,
    currentAuthGeneration: () => 1
  };

  const mockEnrollment = {
    ensureActiveEnrollment: async () => ({
      enrollmentId: 'enroll-claim-uuid',
      programVersionId: 'prog-v1-uuid',
      totalUnitsCount: 45
    }),
    getUnitVersionMap: async () => {
      // Solo mapea c1; unit_missing_999 NO existe en el catálogo
      const map = new Map();
      map.set('c1', 'unit-ver-c1-uuid');
      return map;
    }
  };

  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: CourseService, useClass: CourseService },
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: EnrollmentService, useValue: mockEnrollment },
      { provide: GuestClaimService, useClass: GuestClaimService }
    ]
  });

  const guestClaim = runInInjectionContext(injector, () => injector.get(GuestClaimService));
  assert.ok(guestClaim instanceof GuestClaimService, 'Debe ser instancia real de GuestClaimService');

  const claimResult = await guestClaim.importGuestProgress();

  // Verificaciones exactas
  assert.strictEqual(claimResult.success, false, 'No debe ser 100% exitoso si hubo lecciones no encontradas');
  assert.strictEqual(claimResult.importedCount, 1, 'Solo debe haber confirmado c1');
  assert.strictEqual(claimResult.failedCount, 1, 'unit_missing_999 debió fallar');

  // Solo c1 debió persistirse en Supabase
  assert.strictEqual(persistedProgress.length, 1);
  assert.strictEqual(persistedProgress[0].unit_version_id, 'unit-ver-c1-uuid');

  // unit_missing_999 permanece intacta en almacenamiento de invitado
  const remaining = guestClaim.getGuestLessons();
  assert.deepStrictEqual(remaining, ['unit_missing_999'], 'La lección ausente debe preservarse en guest storage');
  assert.strictEqual(guestClaim.hasGuestData(), true, 'hasGuestData debe seguir activo');
  assert.strictEqual(guestClaim.failedLessons().length, 1);
  assert.strictEqual(guestClaim.failedLessons()[0].lessonId, 'unit_missing_999');

  // isImporting debe ser false al terminar
  assert.strictEqual(guestClaim.isImporting(), false, 'isImporting debe volver a false');
});

// -----------------------------------------------------------------------------
// Test 3: SyncQueueService - Aislamiento durante cambio A → B
// -----------------------------------------------------------------------------
await testCase('3. SyncQueueService: Despacho tardío de A NO altera colas ni deadletter de B', async () => {
  const mockStorage = createMockLocalStorage();
  global.localStorage = mockStorage;

  let authGen = 1;
  let activeUser = { id: 'user_A' };

  const mockSupabase = {
    client: {
      from: () => ({
        upsert: async () => {
          // Simular latencia de red: durante este tiempo el usuario cambia a B
          authGen = 2;
          activeUser = { id: 'user_B' };
          namespaceService.setActiveUser('user_B');
          return { error: null };
        }
      })
    },
    currentUser: () => activeUser,
    isAuthenticated: () => true,
    currentAuthGeneration: () => authGen,
    setSyncStatus: () => {}
  };

  const mockEnrollment = {
    ensureActiveEnrollment: async () => ({
      enrollmentId: 'enroll-A',
      programVersionId: 'prog-A',
      totalUnitsCount: 45
    }),
    getUnitVersionMap: async () => new Map([['c1', 'uv-c1']])
  };

  const injector = Injector.create({
    providers: [
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: EnrollmentService, useValue: mockEnrollment },
      { provide: SyncQueueService, useClass: SyncQueueService }
    ]
  });

  const namespaceService = runInInjectionContext(injector, () => injector.get(StorageNamespaceService));
  const syncQueue = runInInjectionContext(injector, () => injector.get(SyncQueueService));
  assert.ok(syncQueue instanceof SyncQueueService, 'Debe ser instancia real de SyncQueueService');

  // Inicializar bajo Usuario A y encolar tarea
  namespaceService.setActiveUser('user_A');
  syncQueue.enqueue('unit_progress', 'c1', 'upsert', { lessonId: 'c1' });

  // Usuario B tiene su propia cola limpia
  assert.strictEqual(syncQueue.getQueueForUser('user_B').length, 0);

  // Ejecutar procesamiento iniciado por A
  await syncQueue.processQueue();

  // Al terminar, la cola y deadletter de B deben permanecer totalmente vacías e intactas
  const queueB = syncQueue.getQueueForUser('user_B');
  const deadletterB = syncQueue.getDeadletterForUser('user_B');

  assert.strictEqual(queueB.length, 0, 'La cola de B debe estar intacta');
  assert.strictEqual(deadletterB.length, 0, 'El deadletter de B debe estar intacto');
});

// -----------------------------------------------------------------------------
// Test 4: UserProgressService - Porcentaje dinámico contra catálogo real
// -----------------------------------------------------------------------------
await testCase('4. UserProgressService: Cálculo dinámico de avance sin denominador fijo de 45', async () => {
  const mockStorage = createMockLocalStorage();
  global.localStorage = mockStorage;

  const mockSupabase = {
    client: null,
    currentUser: () => null,
    isAuthenticated: () => false,
    currentAuthGeneration: () => 1
  };

  const mockSyncQueue = {
    enqueue: () => {}
  };

  const mockEnrollment = {
    ensureActiveEnrollment: async () => null
  };

  const injector = Injector.create({
    providers: [
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: CourseService, useClass: CourseService },
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: EnrollmentService, useValue: mockEnrollment },
      { provide: SyncQueueService, useValue: mockSyncQueue },
      { provide: UserProgressService, useClass: UserProgressService }
    ]
  });

  const progressService = runInInjectionContext(injector, () => injector.get(UserProgressService));
  assert.ok(progressService instanceof UserProgressService, 'Debe ser instancia real de UserProgressService');

  // Marcar 1 lección completada (catálogo real tiene 45 unidades en CourseService)
  progressService.markLessonAsCompleted('c1');
  let state = progressService.getProgress()();
  assert.strictEqual(state.completedLessons.length, 1);
  assert.strictEqual(state.completionPercentage, 2); // Math.round((1/45) * 100) = 2%

  // Marcar 9 lecciones
  ['c2', 'c3', 'd1', 'l1', 'c4', 'c5', 'c6', 'd2'].forEach(id => progressService.markLessonAsCompleted(id));
  state = progressService.getProgress()();
  assert.strictEqual(state.completedLessons.length, 9);
  assert.strictEqual(state.completionPercentage, 20); // Math.round((9/45) * 100) = 20%
});

// -----------------------------------------------------------------------------
// Test 5: UserPreferencesService - CRDT LWW y restauración de historial
// -----------------------------------------------------------------------------
await testCase('5. UserPreferencesService: Merge CRDT LWW y restauración de historial remoto', async () => {
  const mockStorage = createMockLocalStorage();
  global.localStorage = mockStorage;

  const mockSyncQueue = {
    enqueue: () => {}
  };

  const remoteData = {
    favorites: [
      { id: 'fav_old', deleted: false, updated_at: '2026-01-01T00:00:00.000Z' },
      { id: 'fav_recent_remote', deleted: false, updated_at: '2026-09-01T00:00:00.000Z' }
    ],
    history: [
      { path: '/academy/lesson-remote', title: 'Lección Remota', visited_at: '2026-09-02T00:00:00.000Z' }
    ]
  };

  const mockSupabase = {
    client: {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: remoteData, error: null })
          })
        })
      })
    },
    currentUser: () => ({ id: 'user_prefs_test' }),
    isAuthenticated: () => true,
    currentAuthGeneration: () => 1
  };

  const injector = Injector.create({
    providers: [
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: SyncQueueService, useValue: mockSyncQueue },
      { provide: UserPreferencesService, useClass: UserPreferencesService }
    ]
  });

  const prefsService = runInInjectionContext(injector, () => injector.get(UserPreferencesService));
  assert.ok(prefsService instanceof UserPreferencesService, 'Debe ser instancia real de UserPreferencesService');

  // Esperar resolución de fetchRemotePreferences
  await new Promise(r => setTimeout(r, 50));

  assert.strictEqual(prefsService.isFavorite('fav_recent_remote'), true);
  const history = prefsService.getHistory()();
  assert.ok(history.includes('/academy/lesson-remote'), 'El historial remoto debe ser restaurado en local');
});

// -----------------------------------------------------------------------------
// Test 6: Integridad de Catálogo y asignación fidedigna de c4 a m2
// -----------------------------------------------------------------------------
await testCase('6. Catálogo Git: Asignación real de módulos, prerrequisitos y tipos', () => {
  const { modules, lessons } = extractCourseConfig();
  assert.strictEqual(modules.length, 9);
  assert.strictEqual(lessons.length, 45);

  const c4 = lessons.find(l => l.id === 'c4');
  assert.ok(c4);
  assert.strictEqual(c4.moduleId, 'm2', 'c4 pertenece a m2');
  assert.deepStrictEqual(c4.prerequisites, ['l1']);
  assert.strictEqual(c4.type, 'LESSON');
});

// -----------------------------------------------------------------------------
// Test 7: SupabaseService + SyncQueueService - Transición a 'synced' con cola vacía
// -----------------------------------------------------------------------------
await testCase('7. SupabaseService + SyncQueueService: Inicialización de sesión sin cola pendiente transiciona a "synced"', async () => {
  const mockStorage = createMockLocalStorage();
  global.localStorage = mockStorage;

  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: CourseService, useClass: CourseService },
      { provide: EnrollmentService, useClass: EnrollmentService },
      { provide: SupabaseService, useClass: SupabaseService },
      { provide: SyncQueueService, useClass: SyncQueueService }
    ]
  });

  const supabaseService = runInInjectionContext(injector, () => injector.get(SupabaseService));
  const syncQueue = runInInjectionContext(injector, () => injector.get(SyncQueueService));

  // Simular inicio de sesión (usuario nuevo sin tareas pendientes en cola)
  const fakeSession = {
    access_token: 'fake-jwt-token-123',
    user: { id: 'user_synced_test', email: 'test@example.com' }
  };

  supabaseService['handleAuthStateChange']('SIGNED_IN', fakeSession);

  // Esperar microtasks y resolución de inicialización de sesión
  await new Promise(r => setTimeout(r, 50));

  assert.strictEqual(supabaseService.syncStatus(), 'synced', 'El estado debe ser "synced" cuando la cola y deadletter están vacíos');
  assert.strictEqual(supabaseService.currentUser()?.id, 'user_synced_test');

  // Si existen elementos en deadletter, el estado debe ser 'error'
  syncQueue.enqueue('unit_progress', 'item-err-1', 'upsert', { test: true });
  syncQueue.moveToDeadletter('item-err-1', 'unit_progress', 'Fallo irrecuperable de prueba');
  assert.strictEqual(supabaseService.syncStatus(), 'error', 'El estado debe ser "error" cuando existe deadletter');

  // Al limpiar el deadletter, regresa a 'synced'
  syncQueue.clearDeadletter();
  assert.strictEqual(supabaseService.syncStatus(), 'synced', 'El estado debe regresar a "synced" al limpiar deadletter');
});

// -----------------------------------------------------------------------------
// Test 8: SupabaseService - Detección de error OAuth y limpieza de URL
// -----------------------------------------------------------------------------
await testCase('8. SupabaseService: OAuth error callback detecta parámetros de error y limpia URL', async () => {
  let cleanedUrl = null;
  global.window = {
    location: {
      origin: 'http://localhost:4200',
      pathname: '/case-os/',
      hash: '#/academy/modules',
      search: '?error=access_denied&error_description=User+declined+the+authorization+request'
    },
    history: {
      replaceState: (_state, _title, url) => {
        cleanedUrl = url;
      }
    }
  };

  const mockClient = { auth: { exchangeCodeForSession: async () => ({ data: null, error: null }) } };
  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: SupabaseService, useClass: SupabaseService },
      { provide: 'SUPABASE_CLIENT', useValue: mockClient }
    ]
  });

  const supabaseService = runInInjectionContext(injector, () => injector.get(SupabaseService));
  supabaseService['supabase'] = mockClient;

  await supabaseService['handleOAuthCallbackIfNeeded']();

  assert.strictEqual(
    supabaseService.authError(),
    'User declined the authorization request',
    'authError debe contener la descripción del error decodificada'
  );
  assert.strictEqual(
    cleanedUrl,
    'http://localhost:4200/case-os/#/academy/modules',
    'La URL debe limpiarse conservando origin, pathname y hash intactos'
  );
});

// -----------------------------------------------------------------------------
// Test 9: SupabaseService - Registro y login directo con Email y Contraseña
// -----------------------------------------------------------------------------
await testCase('9. SupabaseService: Métodos de registro y login directo con email y contraseña', async () => {
  let capturedSignUp = null;
  let capturedSignIn = null;

  const mockClient = {
    auth: {
      signUp: async (options) => {
        capturedSignUp = options;
        return { data: { user: { id: 'u-reg-1', email: options.email }, session: null }, error: null };
      },
      signInWithPassword: async (credentials) => {
        capturedSignIn = credentials;
        return { data: { user: { id: 'u-reg-1', email: credentials.email }, session: { access_token: 'fake-jwt' } }, error: null };
      }
    }
  };

  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: SupabaseService, useClass: SupabaseService }
    ]
  });

  const supabaseService = runInInjectionContext(injector, () => injector.get(SupabaseService));
  supabaseService['supabase'] = mockClient;

  // 1. Registro con nombre de usuario
  const signUpRes = await supabaseService.signUpWithEmail('learner@case-os.dev', 'SecretPass123!', 'Alex Engineer');
  assert.strictEqual(signUpRes.error, null);
  assert.strictEqual(capturedSignUp.email, 'learner@case-os.dev');
  assert.strictEqual(capturedSignUp.options.data.full_name, 'Alex Engineer');

  // 2. Inicio de sesión directo
  const signInRes = await supabaseService.signInWithPassword('learner@case-os.dev', 'SecretPass123!');
  assert.strictEqual(signInRes.error, null);
  assert.strictEqual(capturedSignIn.email, 'learner@case-os.dev');
  assert.strictEqual(capturedSignIn.password, 'SecretPass123!');
});

// -----------------------------------------------------------------------------
// Test 10: SupabaseService - Soporte para PASSWORD_RECOVERY y actualización
// -----------------------------------------------------------------------------
await testCase('10. SupabaseService: Soporte de estado PASSWORD_RECOVERY y actualización de contraseña', async () => {
  let capturedUpdate = null;
  const mockClient = {
    auth: {
      updateUser: async (payload) => {
        capturedUpdate = payload;
        return { data: { user: { id: 'rec-user' } }, error: null };
      }
    }
  };

  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: SupabaseService, useClass: SupabaseService }
    ]
  });

  const supabaseService = runInInjectionContext(injector, () => injector.get(SupabaseService));
  supabaseService['supabase'] = mockClient;

  // 1. Recibir evento PASSWORD_RECOVERY
  supabaseService['handleAuthStateChange']('PASSWORD_RECOVERY', {
    access_token: 'recovery-token',
    user: { id: 'rec-user', email: 'recovery@case-os.dev' }
  });

  assert.strictEqual(supabaseService.isPasswordRecovery(), true, 'Debe activar flag isPasswordRecovery');
  assert.strictEqual(supabaseService.syncStatus(), 'local', 'No debe forzar syncStatus a syncing durante recuperación');
  assert.strictEqual(supabaseService.currentUser()?.email, 'recovery@case-os.dev');

  // 2. Actualizar contraseña con éxito
  const updateRes = await supabaseService.updateUserPassword('BrandNewPassword456!');
  assert.strictEqual(updateRes.error, null);
  assert.strictEqual(capturedUpdate.password, 'BrandNewPassword456!');
  assert.strictEqual(supabaseService.isPasswordRecovery(), false, 'isPasswordRecovery debe desactivarse tras cambio exitoso');
});

// -----------------------------------------------------------------------------
// Test 11: EnrollmentService - Manejo idempotente de carrera 23505
// -----------------------------------------------------------------------------
await testCase('11. EnrollmentService: Concurrencia segura maneja violación 23505 con reconsulta sin fallar', async () => {
  let selectCount = 0;
  const mockClient = {
    from: (table) => ({
      select: (fields, options) => ({
        eq: (col1, val1) => ({
          eq: (col2, val2) => ({
            eq: (col3, val3) => ({
              maybeSingle: async () => {
                if (table === 'program_versions') {
                  return { data: { id: 'prog-uuid-published' }, error: null };
                }
                if (table === 'enrollments') {
                  selectCount++;
                  if (selectCount === 1) {
                    // Primera consulta: parece que no existe aún
                    return { data: null, error: null };
                  }
                  // Segunda consulta tras error 23505: re-consulta devuelve la fila insertada por la otra hebra
                  return { data: { id: 'enroll-won-race-uuid' }, error: null };
                }
                return { data: null, error: null };
              }
            }),
            maybeSingle: async () => ({ data: { id: 'prog-uuid-published' }, error: null })
          })
        }),
        head: true,
        count: 'exact'
      }),
      insert: () => ({
        select: () => ({
          single: async () => {
            // Simular que otra hebra concurrente insertó exactamente en este instante
            const err = new Error('duplicate key value violates unique constraint "uq_user_enrollment"');
            err.code = '23505';
            return { data: null, error: err };
          }
        })
      })
    })
  };

  const mockSupabase = {
    client: mockClient,
    currentAuthGeneration: () => 1
  };

  const injector = Injector.create({
    providers: [
      { provide: CourseService, useClass: CourseService },
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: EnrollmentService, useClass: EnrollmentService }
    ]
  });

  const enrollmentService = runInInjectionContext(injector, () => injector.get(EnrollmentService));
  const res = await enrollmentService.ensureActiveEnrollment('raced-user-uuid', 1);

  assert.notStrictEqual(res, null, 'El resultado no debe ser null ante colisión 23505');
  assert.strictEqual(res?.enrollmentId, 'enroll-won-race-uuid', 'Debe retornar la inscripción reconsultada exitosamente');
});

// -----------------------------------------------------------------------------
// Test 12: GuestClaimService - Recarga reactiva de UserProgressService post-claim
// -----------------------------------------------------------------------------
await testCase('12. GuestClaimService: Dispara recarga reactiva de progreso en UserProgressService tras claim', async () => {
  const mockStorage = createMockLocalStorage();
  global.localStorage = mockStorage;

  // Colocar lección de invitado para reclamar
  mockStorage.setItem('case_guest:completed_lessons', JSON.stringify(['c1']));

  let progressReloaded = false;
  const mockUserProgress = {
    reloadProgress: () => {
      progressReloaded = true;
    }
  };

  const mockClient = {
    from: (table) => ({
      upsert: async () => ({ error: null })
    })
  };

  const mockSupabase = {
    client: mockClient,
    currentUser: () => ({ id: 'claimer-user-id' }),
    currentAuthGeneration: () => 1,
    isAuthenticated: () => true
  };

  const mockEnrollment = {
    ensureActiveEnrollment: async () => ({ enrollmentId: 'enroll-claim', programVersionId: 'pv-claim', totalUnitsCount: 45 }),
    getUnitVersionMap: async () => new Map([['c1', 'unit-v-c1']])
  };

  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: CourseService, useClass: CourseService },
      { provide: EnrollmentService, useValue: mockEnrollment },
      { provide: SupabaseService, useValue: mockSupabase },
      { provide: UserProgressService, useValue: mockUserProgress },
      { provide: GuestClaimService, useClass: GuestClaimService }
    ]
  });

  const guestClaim = runInInjectionContext(injector, () => injector.get(GuestClaimService));
  const claimRes = await guestClaim.importGuestProgress();

  assert.strictEqual(claimRes.success, true);
  assert.strictEqual(claimRes.importedCount, 1);
  assert.strictEqual(progressReloaded, true, 'UserProgressService.reloadProgress() debió ser invocado reactivamente');
  assert.strictEqual(mockStorage.getItem('case_guest:completed_lessons'), null, 'La clave de invitado debió eliminarse tras confirmación');
});

// -----------------------------------------------------------------------------
// Test 13: SupabaseService - Gestión y validación estricta de pre_auth_route
// -----------------------------------------------------------------------------
await testCase('13. SupabaseService: Validación estricta de pre_auth_route y rechazo de rutas externas', async () => {
  const mockSessionStorage = createMockLocalStorage();
  global.sessionStorage = mockSessionStorage;

  const injector = Injector.create({
    providers: [
      { provide: ɵChangeDetectionScheduler, useValue: { notify: () => {}, runningTick: false } },
      { provide: ɵEffectScheduler, useValue: { add: () => {}, remove: () => {} } },
      { provide: LocalStorageProvider, useClass: LocalStorageProvider },
      { provide: StorageNamespaceService, useClass: StorageNamespaceService },
      { provide: SupabaseService, useClass: SupabaseService }
    ]
  });

  const supabaseService = runInInjectionContext(injector, () => injector.get(SupabaseService));

  // 1. Validación de rutas internas seguras
  assert.strictEqual(supabaseService.isValidInternalRoute('#/academy/modules/m01/lesson-01'), true);
  assert.strictEqual(supabaseService.isValidInternalRoute('/dashboard'), true);

  // 2. Rechazo estricto de redirecciones abiertas y protocolos maliciosos
  assert.strictEqual(supabaseService.isValidInternalRoute('https://evil-phishing.com'), false);
  assert.strictEqual(supabaseService.isValidInternalRoute('http://attacker.com/steal'), false);
  assert.strictEqual(supabaseService.isValidInternalRoute('//evil.com/open-redirect'), false);
  assert.strictEqual(supabaseService.isValidInternalRoute('javascript:alert(1)'), false);
  assert.strictEqual(supabaseService.isValidInternalRoute('data:text/html,malicious'), false);
  assert.strictEqual(supabaseService.isValidInternalRoute(''), false);
  assert.strictEqual(supabaseService.isValidInternalRoute(null), false);

  // 3. Guardado y consumo seguro desde sessionStorage
  supabaseService.savePreAuthRoute('#/academy/modules/m04-retrieval-rag/lesson-01');
  const consumed = supabaseService.consumePreAuthRoute();
  assert.strictEqual(consumed, '#/academy/modules/m04-retrieval-rag/lesson-01', 'Debe consumir la ruta previa guardada');

  // 4. Una vez consumida, se vacía (idempotencia de consumo)
  assert.strictEqual(supabaseService.consumePreAuthRoute(), null, 'Debe retornar null al segundo intento');

  // 5. Intentar guardar ruta inválida no debe persistirse
  supabaseService.savePreAuthRoute('https://malicious.com');
  assert.strictEqual(supabaseService.consumePreAuthRoute(), null, 'Rutas maliciosas no deben guardarse');
});

console.log(`\n=== Resumen de Pruebas Reales: ${passedTests}/${totalTests} pruebas superadas ===`);
if (passedTests !== totalTests) {
  process.exit(1);
}

