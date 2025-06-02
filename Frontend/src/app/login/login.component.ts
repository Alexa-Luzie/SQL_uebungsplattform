import { Component, OnInit } from '@angular/core';
import { AuthDataService } from '../auth/auth-data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoggedIn = false;
  isLoading = false;
  errorMessage: string = '';

  constructor(private authService: AuthDataService, private router: Router) {}

  ngOnInit() {
    // Wenn Token vorhanden, Profil laden und ggf. weiterleiten
    if (this.authService.isAuthenticated()) {
      this.authService.getProfile().subscribe({
        next: (profile) => {
          console.log('Profil nach Reload geladen:', profile);
          this.isLoggedIn = true;
          this.redirectBasedOnRole(profile);
        },
        error: (error) => {
          console.error('Fehler beim Profil-Reload:', error);
          // Bei Fehler (z.B. ungültiges Token) auf Login bleiben
        }
      });
    }
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Bitte geben Sie sowohl E-Mail als auch Passwort ein.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).pipe(
      switchMap(() => this.authService.getProfile()),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (profile) => {
        console.log('Login erfolgreich:', profile);
        this.isLoggedIn = true;
        this.redirectBasedOnRole(profile);
      },
      error: (error) => this.handleError(error)
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.isLoading = false;
    console.error('Fehler beim Login:', error);

    if (error.status === 401) {
      this.errorMessage = 'Ungültige E-Mail oder Passwort.';
    } else if (error.status === 0) {
      this.errorMessage = 'Verbindung zum Server konnte nicht hergestellt werden.';
    } else {
      this.errorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';
    }
    this.authService.clearToken();
  }

  private redirectBasedOnRole(profile: any) {
    if (!profile) {
      this.router.navigate(['/login']);
      return;
    }

    if (profile.isBlocked) {
      this.router.navigate(['/blocked']);
      return;
    }

    // Nach Login immer auf Profilseite weiterleiten
    this.router.navigate(['/profile']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}