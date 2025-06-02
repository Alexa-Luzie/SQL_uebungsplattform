
import { Injectable } from '@angular/core';
import { Router, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthDataService } from './auth-data.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthDataService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    if (this.authService.getCurrentUserValue()) {
      return of(true);
    }
    if (this.authService.isAuthenticated()) {
      // Token vorhanden, aber User noch nicht geladen: Hole Profil
      return this.authService.getProfile().pipe(
        map(user => !!user ? true : this.router.createUrlTree(['/login'])),
        catchError(() => of(this.router.createUrlTree(['/login'])))
      );
    }
    return of(this.router.createUrlTree(['/login']));
  }
}
