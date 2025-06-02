import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sql-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sql-upload.component.html',
  styleUrls: ['./sql-upload.component.scss']
})
export class SqlUploadComponent {
  selectedFile: File | null = null;
  message = '';
  uploading = false;

  constructor(private http: HttpClient) {}

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
          this.uploading = false;
        },
        error: (err) => {
          this.message = err.error?.message || 'Fehler beim Upload!';
          this.uploading = false;
        }
      });
  }
}
