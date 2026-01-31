import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { Chip } from 'primeng/chip';
import { Button } from 'primeng/button';
import { FiltersStore } from '../../state/filters.store';

@Component({
  selector: 'app-filter-summary',
  templateUrl: './filter-summary.component.html',
  styleUrl: './filter-summary.component.scss',
  imports: [Card, Chip, Button],
})
export class FilterSummaryComponent {
  private readonly store = inject(FiltersStore);
  readonly filters = this.store.stepperFilters;

  removeMunicipalUnit(value: string) {
    this.store.updateStepperFilters({
      municipalUnits: this.filters().municipalUnits.filter((x) => x !== value),
    });
  }

  clearFilters() {
    this.store.clearStepperFilters();
  }
}
