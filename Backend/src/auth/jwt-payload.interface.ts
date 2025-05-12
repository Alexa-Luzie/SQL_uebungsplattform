// src/auth/jwt-payload.interface.ts

export interface JwtPayload {
  email: string;
  name: string; // Name des Benutzers
  sub: string; // 'sub' ist in der Regel die Benutzer-ID
  rolle: string; // Rolle des Benutzers (z.B. 'admin', 'user')
}
