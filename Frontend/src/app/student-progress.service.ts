import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentProgress {
  student: { id: string; name: string; email: string; };
  tasksTotal: number;
  tasksSolved: number;
  errors: number;
}

@Injectable({ providedIn: 'root' })
export class StudentProgressService {
  constructor(private http: HttpClient) {}

  getProgress(): Observable<StudentProgress[]> {
    return this.http.get<StudentProgress[]>('/api/students/progress');
    // Passe ggf. die URL an dein Backend an!
  }
}