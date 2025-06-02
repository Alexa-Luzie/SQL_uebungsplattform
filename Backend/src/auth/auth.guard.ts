import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('AUTH GUARD DEBUG:', { user: request.user, headers: request.headers });
    return !!request.user; // Prüft, ob ein Benutzer authentifiziert ist
  }
}