import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { School } from '../../../../services/school-list.service';
import { StepperFilters } from '../../models';

type SchoolKey = Extract<keyof School, string>;
type GreekLocale = 'el' | 'en';

@Component({
  selector: 'app-stepper-filters',
  templateUrl: './stepper-filters.component.html',
  imports: [FormsModule, TableModule, MultiSelect, Card, StepperModule, Button, Select],
})
export class StepperFiltersComponent {
  readonly schools = input.required<School[]>();
  readonly filters = input.required<StepperFilters>();
  readonly filtersChange = output<Partial<StepperFilters>>();
  readonly activeStep = signal(1);
  readonly regionalUnitOptions = computed(() =>
    this.pickUniqueSorted(this.schools(), 'regional_unit'),
  );
  readonly municipalUnitOptions = computed(() => {
    const regional = this.filters().regionalUnit;
    if (!regional) return [];

    const base = this.schools().filter((s) => this.normalize(s.regional_unit) === regional);
    return this.pickUniqueSorted(base, 'municipal_unit');
  });

  constructor() {
    effect(() => {
      if (!this.filters().regionalUnit) this.activeStep.set(1);
    });
  }

  goNext() {
    if (this.filters().regionalUnit) this.activeStep.set(2);
  }

  goBack() {
    this.activeStep.set(1);
  }

  setRegional(unit: string | null) {
    this.filtersChange.emit({ regionalUnit: unit });
    if (!unit) this.filtersChange.emit({ municipalUnits: [] });
  }

  setMunicipals(units: string[]) {
    this.filtersChange.emit({ municipalUnits: units ?? [] });
  }

  private pickUniqueSorted(list: School[], key: SchoolKey, locale: GreekLocale = 'el'): string[] {
    const values = new Set<string>();
    for (const item of list) {
      const v = this.normalize(item[key]);
      if (v) values.add(v);
    }
    return [...values].sort((a, b) => a.localeCompare(b, locale));
  }

  private normalize(value: unknown): string | null {
    return String(value ?? '').trim() || null;
  }
}
