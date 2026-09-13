import { Injectable, OnDestroy, signal, computed, inject, InjectionToken } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  User,
  Session,
  AuthChangeEvent,
  AuthError,
  Subscription,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Database } from '../models/database.types';
import { StorageNamespaceService } from './storage-namespace.service';
import { GlobalSyncStatus, getStorageNamespace } from '../models/sync.model';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG', {
  providedIn: 'root',
  factory: () => environment,
});

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient<Database> | null>('SUPABASE_CLIENT', {
  providedIn: 'root',
  factory: () => null,
});

@Injectable({
  providedIn: 'root',
})
export class SupabaseService implements OnDestroy {
  private config = inject(SUPABASE_CONFIG, { optional: true }) ?? environment;
  private injectedClient = inject(SUPABASE_CLIENT, { optional: true });
  private namespaceService = inject(StorageNamespaceService);

  private supabase: SupabaseClient<Database> | null = null;
  private authSubscription: Subscription | null = null;
  readonly authGeneration = signal<number>(0);

  readonly currentUser = signal<User | null>(null);
  readonly currentSession = signal<Session | null>(null);
  readonly currentProfile = signal<ProfileRow | null>(null);
  readonly isInitialized = signal<boolean>(false);
  readonly authLoading = signal<boolean>(false);
  readonly authError = signal<string | null>(null);
  readonly profileLoading = signal<boolean>(false);
  readonly profileError = signal<string | null>(null);
  readonly syncStatus = signal<GlobalSyncStatus>('local');
  readonly isPasswordRecovery = signal<boolean>(false);

  private readonly PRE_AUTH_ROUTE_KEY = 'case:pre_auth_route';

  private sessionInitListeners: Array<(userId: string, generation: number) => Promise<void> | void> = [];

  onSessionInit(callback: (userId: string, generation: number) => Promise<void> | void): () => void {
    this.sessionInitListeners.push(callback);
    return () => {
      this.sessionInitListeners = this.sessionInitListeners.filter(cb => cb !== callback);
    };
  }

  currentAuthGeneration(): number {
    return this.authGeneration();
  }

  setSyncStatus(status: GlobalSyncStatus): void {
    this.syncStatus.set(status);
  }

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userDisplayName = computed(() => {
    const prof = this.currentProfile();
    if (prof?.display_name) return prof.display_name;
    const usr = this.currentUser();
    return usr?.user_metadata?.['full_name'] || usr?.user_metadata?.['name'] || usr?.email?.split('@')[0] || 'Invitado';
  });

  readonly userAvatarUrl = computed(() => {
    const prof = this.currentProfile();
    if (prof?.avatar_url) return prof.avatar_url;
    const usr = this.currentUser();
    return usr?.user_metadata?.['avatar_url'] || usr?.user_metadata?.['picture'] || null;
  });

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    if (this.injectedClient) {
      this.supabase = this.injectedClient;
      this.initAuth();
      return;
    }

    const url = this.config.supabaseUrl;
    const anonKey = this.config.supabaseAnonKey;

    if (url && anonKey && url.startsWith('http')) {
      try {
        this.supabase = createClient<Database>(url, anonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false, // Control unificado exclusivo por este servicio para no colisionar con Hash Routing
            flowType: 'pkce',
          },
        });
        this.initAuth();
      } catch (err) {
        console.warn('Error inicializando Supabase client:', err);
        this.supabase = null;
        this.isInitialized.set(true);
      }
    } else {
      this.supabase = null;
      this.isInitialized.set(true);
    }
  }

  private async initAuth(): Promise<void> {
    if (!this.supabase) {
      this.isInitialized.set(true);
      return;
    }

    // 1. Suscripción a eventos de autenticación
    const { data } = this.supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        this.handleAuthStateChange(event, session);
      }
    );
    this.authSubscription = data.subscription;

    // 2. Intercambio PKCE unificado desde la URL si existe un código de retorno OAuth
    await this.handleOAuthCallbackIfNeeded();

    // 3. Restauración de sesión inicial
    const gen = this.authGeneration();
    try {
      const { data: sessionData, error } = await this.supabase.auth.getSession();
      if (this.authGeneration() !== gen) return;

      if (error) {
        this.authError.set(error.message);
        this.isInitialized.set(true);
        return;
      }

      if (!this.isInitialized() || (sessionData?.session && !this.currentSession())) {
        this.handleAuthStateChange('INITIAL_SESSION', sessionData?.session ?? null);
      }
    } catch (err: unknown) {
      if (this.authGeneration() !== gen) return;
      const msg = err instanceof Error ? err.message : 'Error restaurando sesión';
      this.authError.set(msg);
      this.isInitialized.set(true);
    }
  }

  /**
   * Responsable único del intercambio de código PKCE de Google OAuth y captura de errores OAuth.
   * Evita doble intercambio, detecta errores devueltos por el proveedor y preserva la ruta Hash intacta.
   */
  private async handleOAuthCallbackIfNeeded(): Promise<void> {
    if (typeof window === 'undefined' || !this.supabase) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const errorCode = params.get('error_code');
      const errorDescription = params.get('error_description');

      // 1. Detección de errores devueltos por el proveedor OAuth
      if (error || errorCode || errorDescription) {
        const rawMsg = errorDescription || error || errorCode || 'Error durante la autenticación OAuth';
        const message = decodeURIComponent(rawMsg.replace(/\+/g, ' '));
        this.authError.set(message);

        // Limpiar URL tanto en éxito como en error preservando el Hash
        const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
        const title = typeof document !== 'undefined' ? document.title : '';
        window.history.replaceState({}, title, cleanUrl);
        return;
      }

      // 2. Intercambio de código PKCE
      if (code) {
        this.authLoading.set(true);
        try {
          const { data, error: exchangeErr } = await this.supabase.auth.exchangeCodeForSession(code);

          // Limpiar únicamente los parámetros de búsqueda de OAuth, preservando el Hash location
          const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
          const title = typeof document !== 'undefined' ? document.title : '';
          window.history.replaceState({}, title, cleanUrl);

          if (exchangeErr) {
            console.error('Error durante intercambio PKCE:', exchangeErr.message);
            this.authError.set(exchangeErr.message);
          } else if (data.session) {
            this.handleAuthStateChange('SIGNED_IN', data.session);
          }
        } finally {
          this.authLoading.set(false);
        }
      }
    } catch (e) {
      console.warn('Fallo en comprobación de retorno OAuth:', e);
    }
  }

  private handleAuthStateChange(event: AuthChangeEvent, session: Session | null): void {
    if (event === 'PASSWORD_RECOVERY') {
      this.isPasswordRecovery.set(true);
      this.authGeneration.update(g => g + 1);
      this.currentSession.set(session);
      this.currentUser.set(session?.user ?? null);
      this.authError.set(null);
      this.syncStatus.set('local');
      this.isInitialized.set(true);
      return;
    }

    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      this.isPasswordRecovery.set(false);
    }

    const isDuplicate =
      session !== null &&
      this.currentSession()?.access_token === session.access_token &&
      this.currentUser()?.id === session.user.id;

    if (isDuplicate && this.isInitialized()) {
      return;
    }

    this.authGeneration.update(g => g + 1);
    const currentGen = this.authGeneration();

    this.currentSession.set(session);
    this.currentUser.set(session?.user ?? null);
    this.authError.set(null);

    // Cambiar el namespace de almacenamiento activo (aislamiento multiusuario)
    this.namespaceService.setActiveUser(session?.user?.id ?? null);

    if (session?.user) {
      // Sincronización en curso
      this.syncStatus.set('syncing');
      queueMicrotask(() => this.fetchProfile(session.user.id, currentGen));
    } else {
      this.clearIdentityState();
      this.syncStatus.set('local');
    }

    this.isInitialized.set(true);
  }

  private async fetchProfile(userId: string, generation: number): Promise<void> {
    this.profileLoading.set(true);
    this.profileError.set(null);

    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        // Descartar si el usuario cambió antes de la respuesta (authGeneration check)
        if (this.authGeneration() !== generation || this.currentUser()?.id !== userId) {
          return;
        }

        if (error) {
          this.profileError.set(error.message);
          return;
        }

        this.currentProfile.set(data);
      }
    } catch (err: unknown) {
      if (this.authGeneration() === generation && this.currentUser()?.id === userId) {
        this.profileError.set(err instanceof Error ? err.message : 'Error cargando perfil');
      }
    } finally {
      if (this.authGeneration() === generation && this.currentUser()?.id === userId) {
        this.profileLoading.set(false);
        await this.completeSessionInitialization(userId, generation);
      }
    }
  }

  private async completeSessionInitialization(userId: string, generation: number): Promise<void> {
    if (this.authGeneration() !== generation || this.currentUser()?.id !== userId) {
      return;
    }

    // 1. Notificar a SyncQueueService u otros listeners registrados
    for (const listener of this.sessionInitListeners) {
      try {
        await listener(userId, generation);
      } catch (err) {
        console.error('Error en listener de inicialización de sesión:', err);
      }
    }

    // 2. Verificar que el usuario no haya cambiado durante la ejecución de los listeners
    if (this.authGeneration() !== generation || this.currentUser()?.id !== userId) {
      return;
    }

    // 3. Recalcular el estado: si la cola está vacía, no hay deadletter y hay conexión -> synced
    this.recalculateSyncStatus(userId);
  }

  recalculateSyncStatus(userId: string): void {
    if (!this.isAuthenticated()) {
      this.setSyncStatus('local');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.setSyncStatus('offline');
      return;
    }

    try {
      const ns = getStorageNamespace(userId);
      const rawQueue = typeof localStorage !== 'undefined' ? localStorage.getItem(ns.queueKey) : null;
      const rawDeadletter = typeof localStorage !== 'undefined' ? localStorage.getItem(ns.deadletterKey) : null;

      const queue = rawQueue ? JSON.parse(rawQueue) : [];
      const deadletter = rawDeadletter ? JSON.parse(rawDeadletter) : [];

      if (Array.isArray(deadletter) && deadletter.length > 0) {
        this.setSyncStatus('error');
      } else if (Array.isArray(queue) && queue.length > 0) {
        this.setSyncStatus('syncing');
      } else {
        this.setSyncStatus('synced');
      }
    } catch {
      this.setSyncStatus('synced');
    }
  }

  private clearIdentityState(): void {
    this.currentUser.set(null);
    this.currentSession.set(null);
    this.currentProfile.set(null);
    this.profileError.set(null);
    this.profileLoading.set(false);
    this.isPasswordRecovery.set(false);
    this.syncStatus.set('local');
  }

  /**
   * Validación estricta de rutas internas para evitar redirecciones abiertas.
   */
  isValidInternalRoute(route: string | null | undefined): boolean {
    if (!route || typeof route !== 'string') return false;
    const trimmed = route.trim();
    if (trimmed.length === 0) return false;

    // Rechazar URLs absolutas con esquema o relativas de protocolo (ej. //evil.com)
    if (/^([a-zA-Z][a-zA-Z\d+\-.]*:|\/\/)/.test(trimmed)) {
      return false;
    }

    // Rechazar inyección de pseudo-protocolos (ej. javascript:, data:)
    if (/^[a-zA-Z0-9_-]+:/i.test(trimmed)) {
      return false;
    }

    // Aceptar únicamente rutas relativas internas que inicien con #/ o /
    return trimmed.startsWith('#/') || trimmed.startsWith('/');
  }

  /**
   * Guarda de forma segura la ruta contextual antes de iniciar un flujo OAuth.
   * Utiliza sessionStorage según los lineamientos de arquitectura (no localStorage).
   */
  savePreAuthRoute(route?: string): void {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
    try {
      const candidate = route ?? (window.location.hash || window.location.pathname);
      if (this.isValidInternalRoute(candidate)) {
        sessionStorage.setItem(this.PRE_AUTH_ROUTE_KEY, candidate.trim());
      }
    } catch (e) {
      console.warn('No se pudo guardar la ruta previa de autenticación:', e);
    }
  }

  /**
   * Consume la ruta contextual previamente guardada, validando que sea interna y segura.
   */
  consumePreAuthRoute(): string | null {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem(this.PRE_AUTH_ROUTE_KEY);
      if (saved) {
        sessionStorage.removeItem(this.PRE_AUTH_ROUTE_KEY);
        if (this.isValidInternalRoute(saved)) {
          return saved.trim();
        }
      }
    } catch (e) {
      console.warn('No se pudo consumir la ruta previa de autenticación:', e);
    }
    return null;
  }

  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    if (!this.supabase) {
      const err = new AuthError('El cliente de Supabase no está configurado');
      this.authError.set(err.message);
      return { error: err };
    }

    this.authLoading.set(true);
    this.authError.set(null);
    this.savePreAuthRoute();

    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        this.authError.set(error.message);
        return { error };
      }

      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión con Google';
      const authErr = new AuthError(message);
      this.authError.set(authErr.message);
      return { error: authErr };
    } finally {
      this.authLoading.set(false);
    }
  }

  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }> {
    if (!this.supabase) {
      const err = new AuthError('El cliente de Supabase no está configurado');
      this.authError.set(err.message);
      return { data: null, error: err };
    }

    this.authLoading.set(true);
    this.authError.set(null);

    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      const result = await this.supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: displayName?.trim() ? { full_name: displayName.trim() } : undefined,
          emailRedirectTo: redirectUrl,
        },
      });

      if (result.error) {
        this.authError.set(result.error.message);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      const authErr = new AuthError(message);
      this.authError.set(authErr.message);
      return { data: null, error: authErr };
    } finally {
      this.authLoading.set(false);
    }
  }

  async signInWithPassword(
    email: string,
    password: string
  ): Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }> {
    if (!this.supabase) {
      const err = new AuthError('El cliente de Supabase no está configurado');
      this.authError.set(err.message);
      return { data: null, error: err };
    }

    this.authLoading.set(true);
    this.authError.set(null);

    try {
      const result = await this.supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (result.error) {
        this.authError.set(result.error.message);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      const authErr = new AuthError(message);
      this.authError.set(authErr.message);
      return { data: null, error: authErr };
    } finally {
      this.authLoading.set(false);
    }
  }

  async resetPasswordForEmail(
    email: string
  ): Promise<{ error: AuthError | null }> {
    if (!this.supabase) {
      const err = new AuthError('El cliente de Supabase no está configurado');
      this.authError.set(err.message);
      return { error: err };
    }

    this.authLoading.set(true);
    this.authError.set(null);

    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      const result = await this.supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (result.error) {
        this.authError.set(result.error.message);
        return { error: result.error };
      }

      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al solicitar recuperación de contraseña';
      const authErr = new AuthError(message);
      this.authError.set(authErr.message);
      return { error: authErr };
    } finally {
      this.authLoading.set(false);
    }
  }

  async updateUserPassword(
    newPassword: string
  ): Promise<{ error: AuthError | null }> {
    if (!this.supabase) {
      const err = new AuthError('El cliente de Supabase no está configurado');
      this.authError.set(err.message);
      return { error: err };
    }

    this.authLoading.set(true);
    this.authError.set(null);

    try {
      const result = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (result.error) {
        this.authError.set(result.error.message);
        return { error: result.error };
      }

      this.isPasswordRecovery.set(false);
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar contraseña';
      const authErr = new AuthError(message);
      this.authError.set(authErr.message);
      return { error: authErr };
    } finally {
      this.authLoading.set(false);
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    this.authLoading.set(true);
    this.authError.set(null);
    this.authGeneration.update(g => g + 1);

    if (!this.supabase) {
      this.clearIdentityState();
      this.namespaceService.setActiveUser(null);
      this.authLoading.set(false);
      return { error: null };
    }

    try {
      const result = await this.supabase.auth.signOut();
      this.clearIdentityState();
      this.namespaceService.setActiveUser(null);
      if (result.error) {
        this.authError.set(result.error.message);
      }
      return result;
    } catch (err: unknown) {
      this.clearIdentityState();
      this.namespaceService.setActiveUser(null);
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      const authErr = new AuthError(message);
      this.authError.set(authErr.message);
      return { error: authErr };
    } finally {
      this.authLoading.set(false);
    }
  }

  get client(): SupabaseClient<Database> | null {
    return this.supabase;
  }

  get isConfigured(): boolean {
    return this.supabase !== null;
  }

  get syncStatusLabel(): string {
    if (this.supabase && this.isAuthenticated()) {
      return `Conectado: ${this.userDisplayName()}`;
    }
    if (this.supabase) {
      return 'Modo Local (Supabase Disponible)';
    }
    return 'Almacenamiento Local (Offline)';
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
