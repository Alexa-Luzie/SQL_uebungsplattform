export class User {
  id: string; // Benutzer-ID
  email: string; // E-Mail-Adresse des Benutzers
  name: string; // Name des Benutzers
  password: string; // Passwort des Benutzers
  rolle?: string; // Optional: Rolle des Benutzers (z. B. Admin, Tutor, Student)
}