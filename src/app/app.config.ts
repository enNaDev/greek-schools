import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { FiltersPersistenceService } from './services/filters.persistence.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEnvironmentInitializer(() => inject(FiltersPersistenceService)),
    providePrimeNG({
      overlayAppendTo: 'body',
      theme: {
        preset: Aura,
        options: {
          cssLayer: false,
        },
      },
    }),
  ],
};
