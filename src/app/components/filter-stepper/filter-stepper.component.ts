import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Chip } from 'primeng/chip';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { School } from '../../services/school-list.service';

type SchoolKey = Extract<keyof School, string>;
type GreekLocale = 'el' | 'en';

@Component({
  selector: 'app-filter-stepper',
  templateUrl: './filter-stepper.component.html',
  imports: [FormsModule, TableModule, MultiSelect, Card, StepperModule, Button, Chip, Select],
})
export class FilterStepper {
  readonly schools = input.required<School[]>();

  readonly selectedRegionalUnit = input<string | null>(null);
  readonly selectedMunicipalUnits = input<string[]>([]);

  readonly selectedRegionalUnitChange = output<string | null>();
  readonly selectedMunicipalUnitsChange = output<string[]>();
  readonly clear = output<void>();

  readonly activeStep = signal(1);

  readonly regionalUnitOptions = computed(() =>
    this.pickUniqueSorted(this.schools(), 'regional_unit'),
  );

  readonly municipalUnitOptions = computed(() => {
    const regional = this.selectedRegionalUnit();
    const base = regional
      ? this.schools().filter((s) => this.normalize(s.regional_unit) === regional)
      : [];

    return this.pickUniqueSorted(base, 'municipal_unit');
  });

  constructor() {
    effect(() => {
      if (!this.selectedRegionalUnit()) {
        this.activeStep.set(1);
      }
    });
  }

  goNext() {
    if (this.selectedRegionalUnit()) {
      this.activeStep.set(2);
    }
  }

  goBack() {
    this.activeStep.set(1);
  }

  setRegional(unit: string | null) {
    this.selectedRegionalUnitChange.emit(unit);
    if (!unit) this.selectedMunicipalUnitsChange.emit([]);
  }

  setMunicipals(units: string[]) {
    this.selectedMunicipalUnitsChange.emit(units ?? []);
  }

  clearStepperFilters() {
    this.clear.emit();
  }

  removeRegionalUnit() {
    this.setRegional(null);
  }

  removeMunicipalUnit(value: string) {
    const next = this.selectedMunicipalUnits().filter((municipalUnit) => municipalUnit !== value);
    this.selectedMunicipalUnitsChange.emit(next);
  }

  private pickUniqueSorted(list: School[], key: SchoolKey, locale: GreekLocale = 'el'): string[] {
    const values = new Set<string>();
    for (const item of list) {
      const normalized = this.normalize(item[key]);
      if (normalized) {
        values.add(normalized);
      }
    }
    return [...values].sort((a, b) => a.localeCompare(b, locale));
  }

  private normalize(value: unknown): string | null {
    return String(value ?? '').trim() || null;
  }
}
