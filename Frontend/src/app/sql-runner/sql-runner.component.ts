import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Passe das Interface ggf. an dein Projekt an!
export interface Task {
  id: number;
  title: string;
  description: string;
  database?: string;
}

@Component({
  selector: 'app-sql-runner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sql-runner.component.html',
  styleUrls: ['./sql-runner.component.scss']
})
export class SqlRunnerComponent {
  @Input() task: Task | null = null;

  sqlQuery: string = '';
  result: any = null;
  error: string = '';
  authService: any;

  constructor(private http: HttpClient) {}

  ausfuehren() {
    const payload: any = {
      query: this.sqlQuery,
      userId: this.authService.getUserId(), // Benutzer-ID aus dem Auth-Service
    };

    if (this.task?.id) {
      payload.taskId = this.task.id; // Aufgaben-ID nur hinzufügen, wenn sie vorhanden ist
    }

    this.http.post('http://localhost:3000/sql/execute', payload).subscribe({
      next: (res: any) => {
        console.log('Ergebnis:', res);
        if (res.isCorrect !== null) {
          alert(res.isCorrect ? 'Ihre Antwort ist korrekt!' : 'Ihre Antwort ist falsch. Bitte versuchen Sie es erneut.');
        }
      },
      error: (err) => {
        console.error('Fehler:', err);
      },
    });
  }
}
