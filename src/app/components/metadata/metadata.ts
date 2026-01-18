import { Component, computed, input, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { MetaData } from '../../services/school-list.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.html',
  imports: [
    Card,
    Tag,
    Skeleton,
  ],
})
export class MetaDataComponent {
  readonly metaData = input.required<MetaData | undefined>();
  readonly loading = signal(false);

  readonly lastUpdate = computed(() => {
    const lastUpdate = this.metaData()?.data_last_update;
    return lastUpdate ? this.formatDate(lastUpdate) : undefined;
  });

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
