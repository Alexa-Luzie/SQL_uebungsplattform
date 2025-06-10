import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../../tasks.service';
import { SqlRunnerComponent } from '../../sql-runner/sql-runner.component';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule, SqlRunnerComponent],
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  loading = false;
  error: string | null = null;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.loading = true;
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Fehler beim Laden der Aufgaben';
        this.loading = false;
      }
    });
  }

  onTaskSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const idx = select.selectedIndex - 1;
    this.selectedTask = idx >= 0 ? this.tasks[idx] : null;
  }
}
