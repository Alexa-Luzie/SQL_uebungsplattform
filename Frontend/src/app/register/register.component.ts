import { Component } from '@angular/core';
import { AuthDataService } from '../auth/auth-data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule], 
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  isLoggedIn = false;
  isLoading = false;
  errorMessage: string = '';

  constructor(private authService: AuthDataService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onRegister() {
    if (!this.email || !this.password || !this.name) {
      this.errorMessage = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      email: this.email.trim(),
      password: this.password,
      name: this.name.trim(),
    }).subscribe({
      next: (res) => {
        console.log('Registrierung erfolgreich:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Fehler bei der Registrierung:', err);

        if (err.status === 409) {
          this.errorMessage = 'Diese E-Mail-Adresse ist bereits registriert.';
        } else if (err.status === 400) {
          this.errorMessage = 'Ungültige Eingaben. Bitte überprüfen Sie Ihre Daten.';
        } else if (err.status === 500) {
          this.errorMessage = 'Serverfehler. Bitte versuchen Sie es später erneut.';
        } else {
          this.errorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';
        }
      },
      complete: () => this.isLoading = false,
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
