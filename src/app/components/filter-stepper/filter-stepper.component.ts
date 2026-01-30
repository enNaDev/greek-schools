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
  readonly filteredSchoolsChange = output<School[]>();

  readonly activeStep = signal(1);
  readonly selectedRegionalUnit = signal<string | null>(null);
  readonly selectedMunicipalUnits = signal<string[]>([]);

  readonly regionalUnitOptions = computed(() =>
    this.pickUniqueSorted(this.schools(), 'regional_unit'),
  );

  readonly municipalUnitOptions = computed(() =>
    this.pickUniqueSorted(
      this.bySelected(this.schools(), 'regional_unit', this.selectedRegionalUnit()),
      'municipal_unit',
    ),
  );

  readonly stepperFilteredSchools = computed(() => {
    const afterRegional = this.bySelected(
      this.schools(),
      'regional_unit',
      this.selectedRegionalUnit(),
    );
    return this.bySelected(afterRegional, 'municipal_unit', this.selectedMunicipalUnits());
  });

  constructor() {
    effect(() => {
      if (!this.selectedRegionalUnit()) {
        this.selectedMunicipalUnits.set([]);
        this.activeStep.set(1);
      }
    });

    effect(() => {
      this.filteredSchoolsChange.emit(this.stepperFilteredSchools());
    });
  }

  clearStepperFilters() {
    this.selectedRegionalUnit.set(null);
  }

  removeRegionalUnit() {
    this.selectedRegionalUnit.set(null);
  }

  removeMunicipalUnit(value: string) {
    this.selectedMunicipalUnits.update((currentList) =>
      currentList.filter((item) => item !== value),
    );
  }

  private pickUniqueSorted(list: School[], key: SchoolKey, locale: GreekLocale = 'el'): string[] {
    const values = new Set<string>();

    for (const item of list) {
      const v = this.normalize(item[key]);
      if (v) values.add(v);
    }

    return [...values].sort((a, b) => a.localeCompare(b, locale));
  }

  private bySelected(list: School[], key: SchoolKey, selected: string | string[] | null): School[] {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) return list;

    const allowed = new Set(Array.isArray(selected) ? selected : [selected]);

    return list.filter((item) => allowed.has(this.normalize(item[key]) ?? ''));
  }

  private normalize(value: unknown): string | null {
    return String(value ?? '').trim() || null;
  }
}
