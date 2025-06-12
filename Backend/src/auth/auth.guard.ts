import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('AUTH GUARD DEBUG: request.user:', request.user); // Debugging

    if (!request.user) {
      console.error('AUTH GUARD ERROR: Benutzer ist nicht authentifiziert.');
      return false; // Benutzer ist nicht authentifiziert
    }

    return true; // Benutzer ist authentifiziert
  }
}