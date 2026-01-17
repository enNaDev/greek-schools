import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { finalize, forkJoin, tap } from 'rxjs';
import { MetaData, School, SchoolListService } from './school-list.service';

type MetaDataFields = MetaData['fields'];

interface Field {
  name: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Card, TableModule, Tag, IconField, InputText, InputIcon, MultiSelect, Select, Skeleton],
})
export class App implements OnInit {
  private readonly schoolListService = inject(SchoolListService);

  protected readonly metaData = signal<MetaData | undefined>(undefined);
  protected readonly schools = signal<School[]>([]);
  protected readonly loading = signal(false);

  protected readonly fields = computed<Field[]>(() => {
    const metaData = this.metaData();
    if (!metaData) return [];
    return this.mapMetadataFields(metaData.fields);
  });
  protected readonly lastUpdate = computed(() => {
    const lastUpdate = this.metaData()?.data_last_update;
    return lastUpdate ? this.formatDate(lastUpdate) : undefined;
  });

  protected readonly globalFilterFields = computed(() => this.fields().map((f) => f.name));

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
    return [...fields]
      .sort((a, b) => a.order - b.order)
      .map((field) => ({
        name: field.name,
        title: field.title,
      }));
  }

  private formatDate(input: string): string {
    // normalize to ISO 8601
    const iso = input.replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');

    const date = new Date(iso);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
      `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  }
}
