import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { School } from '../../../../services/school-list.service';
import { FiltersStore } from '../../state/filters.store';
import { normalize, pickUniqueSorted } from '../../utils/stepper-filters.utils';

@Component({
  selector: 'app-stepper-filters',
  templateUrl: './stepper-filters.component.html',
  imports: [FormsModule, TableModule, MultiSelect, Card, StepperModule, Button, Select],
})
export class StepperFiltersComponent {
  private readonly store = inject(FiltersStore);

  readonly filters = this.store.stepperFilters;

  readonly schools = input.required<School[]>();
  readonly activeStep = linkedSignal(() => (this.filters().regionalUnit ? 2 : 1));
  readonly regionalUnitOptions = computed(() => pickUniqueSorted(this.schools(), 'regional_unit'));
  readonly municipalUnitOptions = computed(() => {
    const regional = this.filters().regionalUnit;
    if (!regional) return [];

    const base = this.schools().filter((s) => normalize(s.regional_unit) === regional);
    return pickUniqueSorted(base, 'municipal_unit');
  });

  get regionalUnit(): string | null {
    return this.filters().regionalUnit;
  }

  set regionalUnit(regionalUnit: string | null) {
    this.store.updateStepperFilters({ regionalUnit });
  }

  get municipalUnits(): string[] {
    return this.filters().municipalUnits;
  }

  set municipalUnits(municipalUnits: string[]) {
    this.store.updateStepperFilters({ municipalUnits });
  }

  goNext() {
    if (this.filters().regionalUnit) {
      this.activeStep.set(2);
    }
  }

  goBack() {
    this.activeStep.set(1);
  }
}
