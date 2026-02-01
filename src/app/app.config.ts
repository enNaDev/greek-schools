import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { FiltersPersistenceService } from './services/filters.persistence.service';
import { DarkModeService } from './services/dark-mode.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEnvironmentInitializer(() => {
      inject(FiltersPersistenceService);
      inject(DarkModeService).init();
    }),
    providePrimeNG({
      overlayAppendTo: 'body',
      theme: {
        preset: Aura,
        options: {
          cssLayer: false,
          darkModeSelector: '.dark',
        },
      },
    }),
  ],
};
