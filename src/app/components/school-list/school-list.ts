import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { MetaData, School } from '../../services/school-list.service';

interface Field {
  name: string;
  title: string;
}

type SchoolKey = keyof School & string;

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.html',
  styleUrls: ['./school-list.scss'],
  imports: [
    FormsModule,
    TableModule,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    Skeleton,
  ],
})
export class SchoolList {
  readonly metaData = input.required<MetaData | undefined>();
  readonly fields = input.required<Field[]>();
  readonly schools = input.required<School[]>();
  readonly loading = input(false);

  readonly globalFilterFields = computed(() => this.fields().map((f) => f.name));
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

        if (!raw) {
          continue;
        }

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
}
