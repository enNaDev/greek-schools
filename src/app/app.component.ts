import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize, forkJoin, tap } from 'rxjs';
import { StepperFiltersComponent } from './components/filters/components/stepper-filters/stepper-filters.component';
import {
  applyStepperFilters,
  cascadeStepperFilters,
  sanitizeStepperFilters,
} from './components/filters/utils/stepper-filters.utils';
import { MetaDataComponent } from './components/metadata/metadata.component';
import { SchoolListComponent } from './components/school-list/school-list.component';
import { MetaData, School, SchoolListService } from './services/school-list.service';
import { DEFAULT_STEPPER_FILTERS, StepperFilters } from './components/filters/models';

type MetaDataFields = MetaData['fields'];

interface Field {
  name: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MetaDataComponent, SchoolListComponent, StepperFiltersComponent],
})
export class AppComponent implements OnInit {
  private readonly schoolListService = inject(SchoolListService);

  readonly metaData = signal<MetaData | undefined>(undefined);
  readonly schools = signal<School[]>([]);
  readonly loading = signal(true);

  readonly stepperFilters = signal<StepperFilters>(DEFAULT_STEPPER_FILTERS);

  readonly fields = computed<Field[]>(() => {
    const metaData = this.metaData();
    if (!metaData) return [];
    return this.mapMetadataFields(metaData.fields);
  });

  readonly stepperFilteredSchools = computed(() =>
    applyStepperFilters(this.schools(), this.stepperFilters()),
  );

  ngOnInit() {
    forkJoin({
      metaData: this.schoolListService.getMetaData(),
      schools: this.schoolListService.getSchools(),
    })
      .pipe(
        finalize(() => this.loading.set(false)),
        tap(({ metaData, schools }) => {
          this.metaData.set(metaData);
          this.schools.set(schools);
        }),
      )
      .subscribe();
  }

  updateStepperFilters(patch: Partial<StepperFilters>) {
    this.stepperFilters.update((prev) => {
      const next = sanitizeStepperFilters({ ...prev, ...patch });
      return cascadeStepperFilters(prev, next);
    });
  }

  clearStepperFilters() {
    this.stepperFilters.set(DEFAULT_STEPPER_FILTERS);
  }

  private mapMetadataFields(fields: MetaDataFields): Field[] {
    const excluded = new Set([
      'prefecture',
      'school_district',
      'regional_unit',
      'municipal_unit',
      'district',
      'lat',
      'lng',
    ]);

    return [...fields]
      .filter((field) => !excluded.has(field.name))
      .sort((a, b) => a.order - b.order)
      .map((field) => ({
        name: field.name,
        title: field.title,
      }));
  }
}
