import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthDataService } from './auth/auth-data.service';
import { catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-de-tutorial';
  isLoggedIn = false;
  role: string | null = null;

  constructor(private auth: AuthDataService, public router: Router) {}

  ngOnInit() {
    this.auth.getCurrentUser().subscribe(user => {
      this.isLoggedIn = !!user;
      this.role = user?.rolle ?? user?.role ?? null;
      console.log('Aktuelle Rolle:', this.role);
    });

    // Optional: Initiales Profil holen, falls Token vorhanden
    if (this.auth.isAuthenticated()) {
      this.auth.getProfile().subscribe();
    }

    window.addEventListener('beforeunload', this.logoutOnUnload);
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.logoutOnUnload);
  }

  private checkAuthStatus() {
    this.auth.getProfile().pipe(
      catchError(error => {
        console.error('Auth check failed:', error);
        this.handleUnauthorized();
        return of(null);
      }),
      filter(profile => !!profile) // Only continue if we have a profile
    ).subscribe(profile => {
      this.isLoggedIn = true;
      // Korrigiere hier: Rolle kann "rolle" oder "role" heißen, je nach Backend!
      this.role = profile.rolle ?? profile.role ?? null;
      console.log('Aktuelle Rolle:', this.role);
    });
  }

  private handleUnauthorized() {
    this.isLoggedIn = false;
    this.role = null;
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  onHomeClick() {
    this.router.navigate(['/home']);
  }

  logoutOnUnload = () => {
    this.auth.logout(); // Diese Methode sollte das Token entfernen!
  };
}
