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
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  isLoggedIn = false;

  constructor(private authService: AuthDataService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onRegister() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Name:', this.name);

    const registerData = { email: this.email, password: this.password, name: this.name };
    console.log('Registering with data:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error', error);
      }
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
