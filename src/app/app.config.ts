import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { ShortcutService } from './core/command/shortcut.service';

export function initializeShortcuts(shortcutService: ShortcutService) {
  return () => {
    // La inyección ya fuerza al constructor a ejecutarse y escuchar eventos
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeShortcuts,
      deps: [ShortcutService],
      multi: true
    }
  ],
};
