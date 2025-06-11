import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sql-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sql-upload.component.html',
  styleUrls: ['./sql-upload.component.scss']
})
export class SqlUploadComponent implements OnInit {
  selectedFile: File | null = null;
  message = '';
  uploading = false;
  databases: ImportedDatabase[] = [];
  selectedDbId: number | null = null;
  dbMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDatabases();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    const token = localStorage.getItem('access_token');
    const headers = token ? new HttpHeaders({ 'Authorization': 'Bearer ' + token }) : undefined;
    this.http.post<any>('http://localhost:3000/upload/sql', formData, { headers })
      .subscribe({
        next: (res) => {
          this.message = res.message + ' (' + res.fileName + ')';
          if (res.cleanedName) {
            this.message += `\nBereinigter Name: ${res.cleanedName}`;
          }
          this.uploading = false;
          this.loadDatabases();
        },
        error: (err) => {
          this.message = err.error?.message || 'Fehler beim Upload!';
          this.uploading = false;
        }
      });
  }

  loadDatabases() {
    this.http.get<ImportedDatabase[]>('http://localhost:3000/upload/databases')
      .subscribe({
        next: (data) => this.databases = data,
        error: () => this.databases = []
      });
  }

  createDatabase() {
    if (!this.selectedDbId) return;
    this.dbMessage = 'Erstelle Datenbank...';
    this.http.get<any>(`http://localhost:3000/database/import/${this.selectedDbId}`)
      .subscribe({
        next: (res) => {
          if (res.error) {
            this.dbMessage = res.error;
          } else {
            this.dbMessage = 'Datenbank erfolgreich erstellt: ' + res.dbName;
            this.loadDatabases();
          }
        },
        error: () => this.dbMessage = 'Fehler beim Erstellen der Datenbank!'
      });
  }

  get selectedDbCreated(): boolean {
    const db = this.databases.find(d => d.id === this.selectedDbId);
    return !!db?.created;
  }
}

interface ImportedDatabase {
  id: number;
  name: string;
  created: boolean;
}
