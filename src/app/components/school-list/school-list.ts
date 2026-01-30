import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { MetaData, School } from '../../services/school-list.service';
import { TableColumnPreferencesService } from '../../services/table-column-preferences.service';

interface Field {
  name: string;
  title: string;
}

type SchoolKey = Extract<keyof School, string>;

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.html',
  styleUrls: ['./school-list.scss'],
  imports: [FormsModule, TableModule, IconField, InputIcon, InputText, MultiSelect, Skeleton, Card],
})
export class SchoolList {
  private readonly prefs = inject(TableColumnPreferencesService);
  private readonly storageKey = 'school-list.visible-columns.v1';

  readonly skeletonRows = Array.from({ length: 10 });

  readonly metaData = input.required<MetaData | undefined>();
  readonly fields = input.required<Field[]>();
  readonly schools = input.required<School[]>();
  readonly loading = input(false);

  readonly visibleColumnNames = signal<string[]>(this.readVisibleColumns());

  readonly columnToggleOptions = computed(() =>
    this.fields().map(({ title, name }) => ({ label: title, value: name })),
  );

  readonly visibleFields = computed(() => {
    const all = this.fields();
    const selected = this.visibleColumnNames();

    if (selected.length === 0) return all;

    const selectedSet = new Set(selected);
    return all.filter((f) => selectedSet.has(f.name));
  });

  readonly globalFilterFields = computed(() => this.visibleFields().map((f) => f.name));

  readonly uniqueValuesByField = computed(() =>
    this.buildUniqueValuesMap(this.fields(), this.schools()),
  );

  constructor() {
    effect(() => {
      const fields = this.fields();
      if (fields.length === 0) return;

      const next = this.computeNextVisibleColumns(fields, this.visibleColumnNames());

      if (!this.sameArray(this.visibleColumnNames(), next)) {
        this.visibleColumnNames.set(next);
      }

      this.prefs.write(
        this.storageKey,
        untracked(() => this.visibleColumnNames()),
      );
    });
  }

  onVisibleColumnsChange(names: string[] | null | undefined) {
    if (!names || names.length === 0) return;
    this.visibleColumnNames.set(names);
  }

  optionsForField(name: string): string[] {
    return this.uniqueValuesByField().get(name as SchoolKey) ?? [];
  }

  private readVisibleColumns(): string[] {
    return this.prefs.read(this.storageKey) ?? [];
  }

  private computeNextVisibleColumns(fields: Field[], current: string[]): string[] {
    const allNames = fields.map((f) => f.name);

    if (current.length === 0) return allNames;

    const allowed = new Set(allNames);
    const sanitized = current.filter((n) => allowed.has(n));

    return sanitized.length > 0 ? sanitized : allNames;
  }

  private buildUniqueValuesMap(cols: Field[], schools: School[]): Map<SchoolKey, string[]> {
    const map = new Map<SchoolKey, string[]>();

    for (const col of cols) {
      const key = col.name as SchoolKey;
      map.set(key, this.uniqueSorted(schools, key));
    }

    return map;
  }

  private uniqueSorted(items: School[], key: SchoolKey, locale: string = 'el'): string[] {
    const set = new Set<string>();

    for (const item of items) {
      const v = this.normalize(item[key]);
      if (v) set.add(v);
    }

    return [...set].sort((a, b) => a.localeCompare(b, locale));
  }

  private normalize(value: unknown): string | null {
    return String(value ?? '').trim() || null;
  }

  private sameArray(a: string[], b: string[]) {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
}
