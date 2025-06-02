import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  // Don't add token for login/register requests
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // Add token for all other requests
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          localStorage.removeItem('access_token');
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};