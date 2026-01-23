import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TableColumnPreferencesService {
  private readonly storage = inject(StorageService);

  read(key: string): string[] {
    const value = this.storage.get<unknown>(key);

    if (!Array.isArray(value)) return [];

    return value.filter((x): x is string => typeof x === 'string');
  }

  write(key: string, columns: string[]): void {
    this.storage.set(key, columns);
  }

  clear(key: string): void {
    this.storage.remove(key);
  }
}
