import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthDataService } from './auth-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authDataService: AuthDataService, private router: Router) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean {
  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    this.router.navigate(['/login']);
    return false;
  }

  return true;
}
}
