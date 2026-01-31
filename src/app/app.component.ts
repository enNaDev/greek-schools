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
import { DEFAULT_FILTERS, Filters, StepperFilters } from './components/filters/models';
import { FilterSummaryComponent } from './components/filters/components/filter-summary/filter-summary.component';

type MetaDataFields = MetaData['fields'];

interface Field {
  name: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MetaDataComponent,
    SchoolListComponent,
    StepperFiltersComponent,
    FilterSummaryComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly schoolListService = inject(SchoolListService);

  readonly metaData = signal<MetaData | undefined>(undefined);
  readonly schools = signal<School[]>([]);
  readonly loading = signal(true);

  readonly filters = signal<Filters>(DEFAULT_FILTERS);

  readonly fields = computed<Field[]>(() => {
    const metaData = this.metaData();
    if (!metaData) return [];
    return this.mapMetadataFields(metaData.fields);
  });

  readonly stepperFilteredSchools = computed(() =>
    applyStepperFilters(this.schools(), this.filters().stepperFilters),
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

  private mapMetadataFields(fields: MetaDataFields): Field[] {
    const excluded = new Set([
      'prefecture',
      'school_district',
      'regional_unit',
      'municipal_unit',
      'district',
      'municipality',
      'area',
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
