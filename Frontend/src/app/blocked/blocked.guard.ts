import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthDataService } from '../auth-data.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BlockedGuard implements CanActivate {
  constructor(private auth: AuthDataService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    if (!this.auth.isAuthenticated()) {
      return of(true); // Nicht eingeloggt: kein Block
    }
    return this.auth.getProfile().pipe(
      map(profile => {
        if (profile.isBlocked) {
          return this.router.createUrlTree(['/blocked']);
        }
        return true;
      }),
      catchError(() => of(true))
    );
  }
}