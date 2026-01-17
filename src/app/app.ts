import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { School, SchoolListService } from './school-list.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly schoolListService = inject(SchoolListService);

  protected readonly title = signal('greek-schools');
  protected readonly schools = signal<School[]>([]);

  ngOnInit() {
    this.schoolListService.getSchools().subscribe((res) => this.schools.set(res));
  }
}
