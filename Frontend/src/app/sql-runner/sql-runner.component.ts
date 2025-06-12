import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthDataService } from '../auth/auth-data.service';
import { Task } from '../tasks.service';

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
  feedbackMessage: string | null = null;
  isCorrect: boolean | null = null;

  constructor(private http: HttpClient, private authDataService: AuthDataService) {}

  ausfuehren() {
    if (!this.sqlQuery || this.sqlQuery.trim() === '') {
      this.error = 'Die SQL-Abfrage darf nicht leer sein.';
      this.result = null;
      this.feedbackMessage = null;
      return;
    }

    const payload: any = {
      query: this.sqlQuery,
      userId: this.authDataService.getUserId(),
    };

    if (this.task?.id) {
      payload.taskId = this.task.id;
    }
    if (this.task?.database) {
      payload.database = this.task.database;
    }

    this.http.post('http://localhost:3000/sql/execute', payload).subscribe({
      next: (res: any) => {
        console.log('Ergebnis:', res);
        if (res && res.result && Array.isArray(res.result)) {
          this.result = res.result;
          this.isCorrect = res.isCorrect;
          this.feedbackMessage = this.isCorrect
            ? 'Ihre Antwort ist korrekt!'
            : 'Ihre Antwort ist leider falsch. Bitte versuchen Sie es erneut.';
          this.error = '';

          if (this.isCorrect) {
            this.saveCorrectAnswer();
          }
        } else {
          this.result = null;
          this.error = 'Ungültiges Datenformat. Daten sind nicht Array.';
          this.feedbackMessage = null;
        }
      },
      error: (err) => {
        console.error('Fehler:', err);
        this.result = null;
        this.error = 'Fehler beim Ausführen der SQL-Abfrage.';
        this.feedbackMessage = null;
      }
    });
  }

  saveCorrectAnswer(): void {
    if (!this.task) {
      console.error('Keine gültige Aufgabe ausgewählt.');
      return;
    }

    const payload = {
      taskId: this.task.id,
      solution: this.sqlQuery,
      userId: this.authDataService.getUserId()
    };

    this.http.post('http://localhost:3000/solutions', payload).subscribe({
      next: (response: any) => {
        console.log('Die richtige Antwort wurde erfolgreich gespeichert.');
        if (response.status === 'fertig' && this.task) {
          this.task.status = 'fertig'; // Aktualisiere den Status lokal
        }
      },
      error: (err) => {
        console.error('Fehler beim Speichern der richtigen Antwort:', err);
      }
    });
  }

  hasResultData(): boolean {
    return this.result && Array.isArray(this.result) && this.result.length > 0;
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
