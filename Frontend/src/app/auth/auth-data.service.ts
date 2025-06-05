import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  // Synchronen Zugriff auf aktuellen User ermöglichen (für Guards)
  getCurrentUserValue(): any {
    return this.currentUser$.getValue();
  }
  getUserId(): number | null {
    const currentUser = this.getCurrentUserValue();
    return currentUser ? currentUser.id : null;
  }
  private baseUrl = 'http://localhost:3000';
  private authUrl = `${this.baseUrl}/auth`;
  private currentUser$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // Registrierung
  register(data: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Login
  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, data).pipe(
      tap(response => {
        if (response.access_token) {
          this.saveToken(response.access_token);
          this.currentUser$.next(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Profil (geschützte Route)
  getProfile(): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    return this.http.get(`${this.baseUrl}/users/me`).pipe(
      tap(user => {
        console.log('User vom Backend nach Reload:', user);
        this.currentUser$.next(user);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.clearToken();
          this.currentUser$.next(null); // <--- HIER ergänzen!
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Invalid credentials';
      this.clearToken();
    }
    console.error('Auth service error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Token speichern
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Token löschen
  clearToken(): void {
    localStorage.removeItem('access_token');
    console.log('Token wurde gelöscht.');
  }

  // Überprüfen, ob der Benutzer angemeldet ist
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUser$.next(null);
  }
}
