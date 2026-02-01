import { Injectable, computed, signal } from '@angular/core';
import { DEFAULT_FILTERS, Filters, StepperFilters } from '../models';
import { cascadeStepperFilters, sanitizeStepperFilters } from '../utils/stepper-filters.utils';

@Injectable({ providedIn: 'root' })
export class FiltersStore {
  readonly filters = signal<Filters>(DEFAULT_FILTERS);

  readonly stepperFilters = computed(() => this.filters().stepperFilters);

  updateStepperFilters(patch: Partial<StepperFilters>) {
    const current = this.filters();
    const prev = current.stepperFilters;
    const next = sanitizeStepperFilters({ ...prev, ...patch });
    const cascaded = cascadeStepperFilters(prev, next);
    this.filters.set({ ...current, stepperFilters: cascaded });
  }

  clearStepperFilters() {
    const current = this.filters();
    this.filters.set({ ...current, stepperFilters: DEFAULT_FILTERS.stepperFilters });
  }
}
