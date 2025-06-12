import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  users: any[] = []; // Liste der Benutzer
  roles: string[] = ['admin', 'tutor', 'student']; // Verfügbare Rollen
  apiUrl: string = 'http://localhost:3000'; // Beispiel-API-URL
  newUser = { name: '', email: '', role: 'student', password: '' }; // Für das Hinzufügen neuer Benutzer

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers(); // Lade Benutzer beim Initialisieren der Komponente
  }

  // Benutzer aus der API laden
  loadUsers(): void {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe({
      next: (data) => {
        this.users = data; // Benutzerliste aktualisieren
      },
      error: (error) => {
        console.error('Fehler beim Laden der Benutzer:', error);
      }
    });
  }

  // Rolle eines Benutzers aktualisieren
  updateUserRole(user: any): void {
    this.http.put(`${this.apiUrl}/users/${user.id}/role`, { role: user.role }).subscribe({
      next: () => {
        alert(`Rolle von ${user.name} erfolgreich aktualisiert!`);
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren der Rolle:', error);
        alert('Beim Aktualisieren der Rolle ist ein Fehler aufgetreten.');
      }
    });
  }

  // Benutzer löschen
  deleteUser(userId: number): void {
    if (confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      this.http.delete(`${this.apiUrl}/users/${userId}`).subscribe({
        next: () => {
          alert('Benutzer erfolgreich gelöscht!');
          this.loadUsers(); // Benutzerliste neu laden
        },
        error: (error) => {
          console.error('Fehler beim Löschen des Benutzers:', error);
          alert('Beim Löschen des Benutzers ist ein Fehler aufgetreten.');
        }
      });
    }
  }

  // Neuen Benutzer hinzufügen
  addUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }

    this.http.post(`${this.apiUrl}/users`, this.newUser).subscribe({
      next: () => {
        alert('Benutzer erfolgreich hinzugefügt!');
        this.newUser = { name: '', email: '', role: 'student', password: '' }; // Formular zurücksetzen
        this.loadUsers(); // Benutzerliste neu laden
      },
      error: (error) => {
        console.error('Fehler beim Hinzufügen des Benutzers:', error);
        alert('Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten.');
      }
    });
  }
}