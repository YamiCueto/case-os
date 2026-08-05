import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ClassMetadataComponent } from '../class-metadata/class-metadata.component';
import { ClassNavigationComponent } from '../class-navigation/class-navigation.component';
import { MobileHeaderComponent } from '../mobile-header/mobile-header.component';

@Component({
  selector: 'app-academy-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BreadcrumbComponent,
    ClassMetadataComponent,
    ClassNavigationComponent,
    MobileHeaderComponent
  ],
  template: `
    <div class="flex flex-col min-h-full min-w-0 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <app-mobile-header></app-mobile-header>
      <app-breadcrumb></app-breadcrumb>
      <app-class-metadata></app-class-metadata>
      
      <div class="flex-1 relative my-4">
        <router-outlet></router-outlet>
      </div>
      
      <app-class-navigation></app-class-navigation>
    </div>
  `
})
export class AcademyLayoutComponent {}
