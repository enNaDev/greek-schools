import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize, forkJoin, tap } from 'rxjs';
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
  imports: [MetaDataComponent, SchoolList],
})
export class App implements OnInit {
  private readonly schoolListService = inject(SchoolListService);

  readonly metaData = signal<MetaData | undefined>(undefined);
  readonly schools = signal<School[]>([]);
  readonly loading = signal(false);

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

  private mapMetadataFields(fields: MetaDataFields): Field[] {
    const excluded = new Set(['lat', 'lng']);

    return [...fields]
      .filter((field) => !excluded.has(field.name))
      .sort((a, b) => a.order - b.order)
      .map((field) => ({
        name: field.name,
        title: field.title,
      }));
  }
}
