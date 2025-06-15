import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
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
        this.loading = false;
      }
    });
  }
}