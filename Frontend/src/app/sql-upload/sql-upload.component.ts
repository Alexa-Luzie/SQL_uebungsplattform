import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDatabaseFormComponent } from "../custom-database-form/custom-database-form.component";
import { AuthDataService } from '../auth/auth-data.service';

@Component({
  selector: 'app-sql-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDatabaseFormComponent],
  templateUrl: './sql-upload.component.html',
  styleUrls: ['./sql-upload.component.scss']
})
export class SqlUploadComponent implements OnInit {
  public role: string = '';
  showCustomDbForm = false;
  selectedFile: File | null = null;
  message = '';
  uploading = false;
  databases: ImportedDatabase[] = [];
  selectedDbId: number | null = null;
  dbMessage = '';

  // NEU: Eigene Datenbanken
  customDatabases: CustomDatabase[] = [];
  selectedCustomDbId: number | null = null;
  selectedDbType: 'imported' | 'custom' | null = null;

  constructor(private http: HttpClient, private auth: AuthDataService) {}

  ngOnInit() {
    this.loadDatabases();
    this.loadCustomDatabases(); // NEU
    this.role = this.auth.getRole() ?? '';
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

  // NEU: Eigene Datenbanken laden
  loadCustomDatabases() {
    this.http.get<CustomDatabase[]>('http://localhost:3000/custom-databases')
      .subscribe({
        next: (data) => this.customDatabases = data,
        error: () => this.customDatabases = []
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

  deleteDatabase(type: 'imported' | 'custom', id: number) {
    let url = '';
    if (type === 'imported') {
      url = `http://localhost:3000/imported-databases/${id}`;
    } else {
      url = `http://localhost:3000/custom-databases/${id}`;
    }
    this.http.delete(url).subscribe({
      next: () => {
        this.loadDatabases();
        this.loadCustomDatabases();
      },
      error: () => alert('Fehler beim Löschen!')
    });
  }

  // Für Bearbeiten könntest du ein Dialog/Modal öffnen und die Datenbankdaten übergeben
  editDatabase(type: 'imported' | 'custom', db: any) {
    // Öffne ein Bearbeitungsformular (z.B. Modal/Dialog)
    // Übergib db und type
  }

  get selectedDbCreated(): boolean {
    const db = this.databases.find(d => d.id === this.selectedDbId);
    return !!db?.created;
  }

  get selectedDatabaseId(): number | null {
    return this.selectedDbType === 'imported' ? this.selectedDbId : this.selectedCustomDbId;
  }
}

interface ImportedDatabase {
  id: number;
  name: string;
  created: boolean;
}

// NEU: Interface für eigene Datenbanken
interface CustomDatabase {
  id: number;
  name: string;
}
