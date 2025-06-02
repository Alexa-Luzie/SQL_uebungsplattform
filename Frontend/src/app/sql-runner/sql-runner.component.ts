import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sql-runner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sql-runner.component.html',
  styleUrl: './sql-runner.component.scss'
})
export class SqlRunnerComponent {
  sqlQuery: string = ''; // Variable für die SQL-Abfrage
  result: any = null;  // Variable für das Ergebnis der SQL-Abfrage
  error: string = ''; // Variable für Fehlernachrichten

  constructor(private http: HttpClient) {}

  ausfuehren() { // Methode zum Ausführen der SQL-Abfrage
    this.error = '';
    this.result = null;

    this.http.post('http://localhost:3000/sql/execute', { query: this.sqlQuery }).subscribe({
      next: (res) => this.result = res,
      error: (err) => this.error = 'Fehler beim Ausführen der Abfrage',
    });
  }

}
