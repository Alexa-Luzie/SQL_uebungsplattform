import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-custom-database-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-database-form.component.html',
  styleUrls: ['./custom-database-form.component.scss']
})
export class CustomDatabaseFormComponent {
  model = {
    name: '',
    description: '',
    schema: ''
  };
  successMsg = '';
  errorMsg = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';
    this.http.post('http://localhost:3000/custom-databases', this.model).subscribe({
      next: (res) => {
        this.successMsg = 'Datenbank erfolgreich angelegt!';
        this.model = { name: '', description: '', schema: '' };
      },
      error: (err) => {
        this.errorMsg = 'Fehler beim Anlegen: ' + (err.error?.message || err.statusText);
      }
    });
  }
}