import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../../core/services/course.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { Lesson, AcademyModule } from '../../../../core/models/course.models';
import { LESSON_01_DOCUMENT } from './lesson-01.data';
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
 * Lesson01Embeddings — CASE Academy
 * Módulo 04 · Recuperación y RAG — Lección 01 (c10)
 * Formato: Living Technical Documentation
 */
@Component({
  selector: 'app-lesson-01-embeddings',
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
  templateUrl: './lesson-01-embeddings.html',
  styleUrl: './lesson-01-embeddings.css'
})
export class Lesson01Embeddings implements OnInit {
  private courseService = inject(CourseService);
  private userProgressService = inject(UserProgressService);

  readonly doc = LESSON_01_DOCUMENT;
  
  readonly lesson: Lesson | undefined = this.courseService.getLessonByPath('/academy/modules/m04-retrieval-rag/lesson-01-embeddings');
  readonly module: AcademyModule | undefined = this.courseService.getModuleById('m4');
  readonly adjacentLessons = this.courseService.getAdjacentLessons('c10');

  readonly guideFileName = 'demo_embeddings_python_clase.md';
  readonly guideFilePath = 'docs/demo_embeddings_python_clase.md';
  downloadSuccess = false;
  showDemoOverview = false;

  readonly demoScripts = [
    {
      file: 'demo_01_embeddings.py',
      title: '01. Convertir texto en embeddings',
      desc: 'SentenceTransformer("all-MiniLM-L6-v2") genera vectores numéricos de 384 dimensiones.'
    },
    {
      file: 'demo_02_similarity.py',
      title: '02. Similitud coseno',
      desc: 'Comparación angular por pares con cosine_similarity de scikit-learn.'
    },
    {
      file: 'demo_03_semantic_search.py',
      title: '03. Búsqueda semántica',
      desc: 'Ranking de 5 documentos contra consulta en lenguaje natural sin coincidencias de palabra clave.'
    },
    {
      file: 'demo_04_top_k.py',
      title: '04. Top-K Retrieval',
      desc: 'Selección de los mejores K candidatos relevantes para contexto de RAG.'
    },
    {
      file: 'demo_completa.py',
      title: '05. Demo interactiva completa',
      desc: 'CLI interactiva con loop de preguntas en vivo y prueba del caso límite ("Factura #100245").'
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
