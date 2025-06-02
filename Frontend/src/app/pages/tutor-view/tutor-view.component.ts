import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from '../../tasks-list/tasks-list.component';
import { HttpClient } from '@angular/common/http';

export interface StudentProgress {
  student: { id: string; name: string; email: string; };
  tasksTotal: number;
  tasksSolved: number;
  errors: number;
}

@Component({
  selector: 'app-tutor-view',
  standalone: true,
  imports: [CommonModule, TasksListComponent],
  templateUrl: './tutor-view.component.html',
  styleUrls: ['./tutor-view.component.scss']
})
export class TutorViewComponent implements OnInit {
  progressList: StudentProgress[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<StudentProgress[]>('/api/student-progress').subscribe({
      next: data => {
        this.progressList = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Fehler beim Laden der Fortschrittsdaten';
        this.loading = false;
      }
    });
  }
}