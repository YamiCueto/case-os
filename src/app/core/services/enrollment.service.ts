import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { CourseService } from './course.service';

export interface ActiveEnrollmentInfo {
  enrollmentId: string;
  programVersionId: string;
  totalUnitsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private supabaseService = inject(SupabaseService);
  private courseService = inject(CourseService);

  private cachedUnitMap: Map<string, string> | null = null;
  private cachedProgramVersionId: string | null = null;

  /**
   * Resuelve o crea una inscripción activa para el usuario en el programa especificado.
   * Evita selecciones arbitrarias de limit(1) y vincula explícitamente al programa publicado.
   */
  async ensureActiveEnrollment(
    userId: string,
    expectedGen?: number
  ): Promise<ActiveEnrollmentInfo | null> {
    const client = this.supabaseService.client;
    if (!client) return null;

    const slug = this.courseService.getDefaultProgramSlug();
    const version = this.courseService.getDefaultProgramVersion();

    // 1. Resolver la versión publicada del programa
    const { data: programVersion, error: pvErr } = await client
      .from('program_versions')
      .select('id')
      .eq('slug', slug)
      .eq('version', version)
      .eq('status', 'PUBLISHED')
      .maybeSingle();

    if (expectedGen !== undefined && this.supabaseService.currentAuthGeneration() !== expectedGen) {
      return null;
    }

    if (pvErr || !programVersion) {
      console.warn(`No se encontró versión publicada para ${slug} v${version}:`, pvErr?.message);
      return null;
    }

    const programVersionId = programVersion.id;

    // 2. Contar total real de unidades en la malla de esta versión
    const { count, error: countErr } = await client
      .from('program_units')
      .select('*', { count: 'exact', head: true })
      .eq('program_version_id', programVersionId);

    const totalUnitsCount = count && count > 0 ? count : this.courseService.getTotalUnitsCount();

    // 3. Buscar inscripción activa existente
    const { data: existing, error: findErr } = await client
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('program_version_id', programVersionId)
      .eq('status', 'ACTIVE')
      .maybeSingle();

    if (expectedGen !== undefined && this.supabaseService.currentAuthGeneration() !== expectedGen) {
      return null;
    }

    if (findErr) {
      console.error('Error buscando inscripción existente:', findErr.message);
      return null;
    }

    if (existing) {
      return {
        enrollmentId: existing.id,
        programVersionId,
        totalUnitsCount
      };
    }

    // 4. Si no existe, crear la inscripción automática para el usuario nuevo
    const { data: created, error: createErr } = await client
      .from('enrollments')
      .insert({
        user_id: userId,
        program_version_id: programVersionId,
        status: 'ACTIVE'
      })
      .select('id')
      .single();

    if (expectedGen !== undefined && this.supabaseService.currentAuthGeneration() !== expectedGen) {
      return null;
    }

    if (createErr || !created) {
      console.error('Error al auto-inscribir al usuario nuevo:', createErr?.message);
      return null;
    }

    return {
      enrollmentId: created.id,
      programVersionId,
      totalUnitsCount
    };
  }

  /**
   * Obtiene el mapeo de unit_id (c1, l1...) a unit_version_id para el programa dado.
   */
  async getUnitVersionMap(programVersionId: string): Promise<Map<string, string>> {
    if (this.cachedProgramVersionId === programVersionId && this.cachedUnitMap) {
      return this.cachedUnitMap;
    }

    const client = this.supabaseService.client;
    if (!client) return new Map();

    const { data: units, error } = await client
      .from('program_units')
      .select('unit_version_id, learning_unit_versions!inner(unit_id)')
      .eq('program_version_id', programVersionId);

    if (error || !units) {
      console.error('Error al mapear unidades del programa:', error?.message);
      return new Map();
    }

    const map = new Map<string, string>();
    for (const item of units as any[]) {
      const canonicalId = item.learning_unit_versions?.unit_id;
      if (canonicalId && item.unit_version_id) {
        map.set(canonicalId, item.unit_version_id);
      }
    }

    this.cachedProgramVersionId = programVersionId;
    this.cachedUnitMap = map;
    return map;
  }

  clearCache(): void {
    this.cachedUnitMap = null;
    this.cachedProgramVersionId = null;
  }
}
