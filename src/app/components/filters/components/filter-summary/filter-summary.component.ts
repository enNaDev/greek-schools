import { Component, input, output } from '@angular/core';
import { StepperFilters } from '../../models';
import { Card } from "primeng/card";
import { Chip } from "primeng/chip";
import { Button } from "primeng/button";

@Component({
  selector: 'app-filter-summary',
  templateUrl: './filter-summary.component.html',
  styleUrl: './filter-summary.component.scss',
  imports: [Card, Chip, Button],
})
export class FilterSummaryComponent {
  readonly filters = input.required<StepperFilters>();
  readonly filtersChange = output<Partial<StepperFilters>>();
  readonly clearStepperFilters = output<void>();

  removeMunicipalUnit(value: string) {
    this.filtersChange.emit({
      municipalUnits: this.filters().municipalUnits.filter((x) => x !== value),
    });
  }
  
  clearFilters() {
    this.clearStepperFilters.emit();
  }
}
