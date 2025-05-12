import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private apiUrl = 'http://localhost:3000/auth'; // URL zum NestJS-Backend

  constructor(private http: HttpClient) {}

  // Registrierung
  register(data: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Login
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Profil (geschützte Route)
  getProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/users/me', { headers });
  }

  // Token speichern
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Token löschen
  clearToken(): void {
    localStorage.removeItem('access_token');
  }

  // Überprüfen, ob der Benutzer angemeldet ist
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
