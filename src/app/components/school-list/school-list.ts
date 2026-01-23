import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { MetaData, School } from '../../services/school-list.service';
import { Card } from 'primeng/card';
import { TableColumnPreferencesService } from '../../services/table-column-preferences.service';

interface Field {
  name: string;
  title: string;
}

type SchoolKey = keyof School & string;

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.html',
  styleUrls: ['./school-list.scss'],
  imports: [FormsModule, TableModule, IconField, InputIcon, InputText, MultiSelect, Skeleton, Card],
})
export class SchoolList {
  private readonly prefs = inject(TableColumnPreferencesService);
  private readonly LS_KEY = 'school-list.visible-columns.v1';

  readonly metaData = input.required<MetaData | undefined>();
  readonly fields = input.required<Field[]>();
  readonly schools = input.required<School[]>();
  readonly loading = input(false);
  readonly skeletonRows = Array.from({ length: 10 });

  readonly visibleColumnNames = signal<string[]>(this.prefs.read(this.LS_KEY));

  readonly columnToggleOptions = computed(() =>
    this.fields().map((f) => ({ label: f.title, value: f.name })),
  );

  readonly visibleFields = computed(() => {
    const all = this.fields();
    const selected = new Set(this.visibleColumnNames());

    if (selected.size === 0) return all;

    return all.filter((f) => selected.has(f.name));
  });

  constructor() {
    effect(() => {
      const fields = this.fields();

      if (!fields || fields.length === 0) return;

      const allNames = new Set(fields.map((f) => f.name));
      const current = this.visibleColumnNames();

      if (current.length === 0) {
        const init = fields.map((f) => f.name);
        this.visibleColumnNames.set(init);
        this.prefs.write(this.LS_KEY, init);
        return;
      }

      // Drop names that no longer exist (e.g., backend changed columns)
      const sanitized = current.filter((n) => allNames.has(n));

      // If sanitization removed everything, fall back to all columns
      const finalValue = sanitized.length > 0 ? sanitized : fields.map((f) => f.name);

      if (!this.arraysEqual(current, finalValue)) {
        this.visibleColumnNames.set(finalValue);
      }

      this.prefs.write(this.LS_KEY, this.visibleColumnNames());
    });
  }

  onVisibleColumnsChange(names: string[]) {
    if (!names || names.length === 0) return;
    this.visibleColumnNames.set(names);
  }

  readonly globalFilterFields = computed(() => this.visibleFields().map((f) => f.name));

  readonly uniqueValuesByField = computed(() => {
    const cols = this.fields();
    const schools = this.schools();
    return this.createMap(cols, schools);
  });

  optionsForField(name: string): string[] {
    return this.uniqueValuesByField().get(name as any) ?? [];
  }

  private createMap(cols: Field[], schools: School[]): Map<SchoolKey, string[]> {
    const map = new Map<SchoolKey, string[]>();

    for (const col of cols) {
      const key = col.name as SchoolKey;

      const uniqueValues = new Set<string>();

      for (const s of schools) {
        const raw = s[key];
        if (!raw) continue;

        const value = String(raw).trim();
        if (!value) continue;

        uniqueValues.add(value);
      }

      map.set(
        key,
        Array.from(uniqueValues).sort((a, b) => a.localeCompare(b, 'el')),
      );
    }

    return map;
  }

  private arraysEqual(a: string[], b: string[]) {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
}
