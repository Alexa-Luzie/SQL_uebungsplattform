import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Kein Rollen-Check erforderlich
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Benutzer muss im Request verfügbar sein
    console.log('ROLES GUARD DEBUG:', { roles, user });
    return roles.includes(user?.rolle); // Prüft, ob die Rolle passt
  }
}