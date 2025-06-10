import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthDataService } from '../auth/auth-data.service';
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
  AuthDataService: AuthDataService;

  taskListVisible: boolean = false;
  taskList: Task[] = [];

  constructor(private http: HttpClient, private authDataService: AuthDataService) {
    this.AuthDataService = authDataService;
  }

  ausfuehren() {

    

    if (!this.sqlQuery || this.sqlQuery.trim() === '') {
      this.error = 'Die SQL-Abfrage darf nicht leer sein.';
      this.result = null;
      return;
    }

    const payload: any = {
      query: this.sqlQuery,
      userId: this.AuthDataService.getUserId(),
    };

    if (this.task?.id) {
      payload.taskId = this.task.id;
    }
    if (this.task?.database) {
      payload.database = this.task.database;  // database id 
    }

    this.http.post('http://localhost:3000/sql/execute', payload).subscribe({
      next: (res: any) => {
        console.log('Ergebnis:', res);
        console.log('Serverantwort Struktur:', JSON.stringify(res));
        if (res && res.result && Array.isArray(res.result)) {
          console.log('Daten sind Array:', res.result);
          this.result = res.result;
          this.error = '';
        } else {
          console.warn('Ungültiges Datenformat: Daten sind nicht Array.', res);
          this.result = null;
          this.error = 'Ungültiges Datenformat. Daten sind nicht Array.';
        }
      },
      error: (err) => {
        console.error('Fehler:', err);
        this.result = null;
        this.error = 'Fehler beim Ausführen der SQL-Abfrage.';
      },
    });
  }



  hasResultData(): boolean {
    return this.result && Array.isArray(this.result) && this.result.length > 0;
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
