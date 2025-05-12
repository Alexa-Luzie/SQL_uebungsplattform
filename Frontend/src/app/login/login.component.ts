import { Component } from '@angular/core';
import { AuthDataService } from '../auth/auth-data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoggedIn = false;

  constructor(private authService: AuthDataService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onLogin() {
  const loginData = { email: this.email, password: this.password };
  this.authService.login(loginData).subscribe({
    next: (response) => {
      localStorage.setItem('access_token', response.access_token);
      this.authService.getProfile().subscribe({
        next: (profile) => {
          if (profile.isBlocked) {
            this.router.navigate(['/blocked']).then(() => {
              window.location.reload();
            });
          } else {
            
            this.router.navigate(['/profile']).then(() => {
              window.location.reload();
            });
          }
        }
      });
    },
    error: (error) => {
      console.error('Login error', error);
    }
  });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}