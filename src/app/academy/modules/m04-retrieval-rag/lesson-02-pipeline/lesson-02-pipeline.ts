import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_02_DOCUMENT } from './lesson-02.data';
import { LessonHeaderComponent } from '../../../components/lesson-header/lesson-header.component';
import { LessonComparisonComponent } from '../../../components/lesson-comparison/lesson-comparison.component';
import { LessonFooterComponent } from '../../../components/lesson-footer/lesson-footer.component';
import {
  CaseCalloutComponent,
  CaseCodeBlockComponent,
  CaseBadgeComponent
} from '../../../../core/ui/components';
import { ExperienceRegistryComponent } from '../shared/experiences/experience-registry.component';

/**
 * Lesson02Pipeline — CASE Academy
 * Módulo 04 · Recuperación y RAG — Lección 02 (c11)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-02-pipeline',
  standalone: true,
  imports: [
    CommonModule,
    LessonHeaderComponent,
    LessonComparisonComponent,
    LessonFooterComponent,
    CaseCalloutComponent,
    CaseCodeBlockComponent,
    CaseBadgeComponent,
    ExperienceRegistryComponent
  ],
  templateUrl: './lesson-02-pipeline.html',
  styleUrl: './lesson-02-pipeline.css'
})
export class Lesson02Pipeline implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_02_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m04-retrieval-rag/lesson-02-pipeline');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m4');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c11');

  readonly guideFileName = 'M04-L02-demo-rag-python-por-celulas.md';
  readonly guideFilePath = 'docs/M04-L02-demo-rag-python-por-celulas.md';
  downloadSuccess = false;
  showDemoOverview = false;

  readonly demoSteps = [
    {
      step: 'Dataset',
      file: 'data/knowledge_base.txt',
      title: 'Base de conocimiento de la célula',
      desc: 'Políticas corporativas de contraseñas, desbloqueo y solicitudes de roles.'
    },
    {
      step: 'Paso 01',
      file: 'step_01_chunking.py',
      title: 'Fragmentación estratégica (Chunking)',
      desc: 'División del texto en fragmentos con solapamiento controlado (overlap) para no perder coherencia.'
    },
    {
      step: 'Paso 02',
      file: 'step_02_embeddings.py',
      title: 'Generación de Embeddings (Offline / Ingestion)',
      desc: 'Conversión de fragmentos a vectores de 384 dimensiones usando Sentence Transformers (all-MiniLM-L6-v2).'
    },
    {
      step: 'Paso 03',
      file: 'step_03_retrieval.py',
      title: 'Recuperación Semántica Top-K (Online / Inference)',
      desc: 'Cálculo de similitud coseno entre consulta del usuario y chunks para rankear y seleccionar los mejores K.'
    },
    {
      step: 'Paso 04',
      file: 'step_04_context_build.py',
      title: 'Ensamblaje del Contexto (Context Build)',
      desc: 'Inyección de fragmentos recuperados en una plantilla estructurada lista para enviar al LLM.'
    },
    {
      step: 'Pipeline',
      file: 'demo_rag.py',
      title: 'Tubería RAG completa unificada',
      desc: 'Script integrado de inicio a fin con pruebas de consultas en vivo y distinción Offline vs Online.'
    }
  ];

  ngOnInit(): void {
    if (this.lesson) {
      this.userProgressService.setLastVisitedLesson(
        this.lesson.id,
        this.lesson.title,
        this.lesson.path
      );
    }
  }

  downloadActivityGuide(): void {
    const link = document.createElement('a');
    link.href = this.guideFilePath;
    link.download = this.guideFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.downloadSuccess = true;
    setTimeout(() => {
      this.downloadSuccess = false;
    }, 4000);
  }

  toggleDemoOverview(): void {
    this.showDemoOverview = !this.showDemoOverview;
  }
}
