import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthDataService } from './auth-data.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthDataService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUserValue();
    const role = user?.role ?? user?.rolle;
    if (user && (role === 'ADMIN' || role === 'TUTOR')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
