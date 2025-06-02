import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token aus dem Header extrahieren
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Secret aus der .env-Datei
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, rolle: payload.rolle }; // Benutzerinformationen inkl. Rolle aus dem Token extrahieren
  }
}