import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize, forkJoin, tap } from 'rxjs';
import { FilterStepper } from './components/filter-stepper/filter-stepper.component';
import { MetaDataComponent } from './components/metadata/metadata';
import { SchoolList } from './components/school-list/school-list';
import { MetaData, School, SchoolListService } from './services/school-list.service';

type MetaDataFields = MetaData['fields'];

interface Field {
  name: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [MetaDataComponent, SchoolList, FilterStepper],
})
export class App implements OnInit {
  private readonly schoolListService = inject(SchoolListService);

  readonly metaData = signal<MetaData | undefined>(undefined);
  readonly schools = signal<School[]>([]);
  readonly stepperSchools = signal<School[]>([]);
  readonly loading = signal(true);

  readonly fields = computed<Field[]>(() => {
    const metaData = this.metaData();
    if (!metaData) return [];
    return this.mapMetadataFields(metaData.fields);
  });

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

  onStepperSchoolsChange(filtered: School[]) {
    this.stepperSchools.set(filtered);
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
