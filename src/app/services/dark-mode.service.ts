import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

const LS_KEY = 'ui.darkmode';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly doc = inject(DOCUMENT);

  readonly isDark = signal(false);

  init() {
    const saved = localStorage.getItem(LS_KEY);
    const enabled = saved === 'true' || (saved === null && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    this.setDark(enabled);
  }

  toggle() {
    this.setDark(!this.isDark());
  }

  setDark(enabled: boolean) {
    this.isDark.set(enabled);
    this.doc.documentElement.classList.toggle('dark', enabled);
    localStorage.setItem(LS_KEY, String(enabled));
  }
}
