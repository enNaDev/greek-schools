import { Injectable, effect, inject, untracked } from '@angular/core';
import { FiltersStore } from '../components/filters/state/filters.store';
import { StorageService } from './storage.service';
import { Filters } from '../components/filters/models';

const LS_KEY = 'filters.v1';

@Injectable({
  providedIn: 'root'
})
export class FiltersPersistenceService {
  private readonly storage = inject(StorageService);
  private readonly filtersStore = inject(FiltersStore);

  constructor() {
    this.restoreFilters();

    effect(() => {
      const filters = this.filtersStore.filters();
      this.storage.set(LS_KEY, filters);
    });
  }

  private restoreFilters() {
    const saved = this.storage.get<Filters>(LS_KEY);
    if (saved) {
      this.filtersStore.filters.set(saved);
    }
  }
}
