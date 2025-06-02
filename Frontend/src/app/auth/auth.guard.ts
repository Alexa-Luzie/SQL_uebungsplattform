import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthDataService } from './auth-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthDataService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}
