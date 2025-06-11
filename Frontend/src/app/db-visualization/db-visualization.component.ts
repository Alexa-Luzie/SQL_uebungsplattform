import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-db-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-visualization.component.html',
  styleUrls: ['./db-visualization.component.scss']
})
export class DbVisualizationComponent implements OnChanges {
  @Input() dbId: string | null = null;
  structure: Record<string, { columns: string[]; rows: any[] }> | null = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    if (this.dbId) {
      this.loading = true;
      this.error = null;
      this.structure = null;
      this.http.get<any>(`http://localhost:3000/sql/structure/${this.dbId}`)
        .subscribe({
          next: (data) => {
            if (!data || Object.keys(data).length === 0) {
              this.error = 'Die Datenbank enthält keine Tabellen oder ist leer.';
              this.structure = null;
            } else {
              this.structure = data;
            }
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Fehler beim Laden der DB-Struktur';
            this.structure = null;
            this.loading = false;
          }
        });
    } else {
      this.structure = null;
    }
  }

  asArray(val: unknown): any[] {
    return Array.isArray(val) ? val : [];
  }
}
