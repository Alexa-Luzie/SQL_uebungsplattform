import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token aus dem Header extrahieren
      ignoreExpiration: false, // Token-Ablauf nicht ignorieren
      secretOrKey: process.env.JWT_SECRET || 'default-secret', // Fallback auf Standardwert
    });
  }

  async validate(payload: any) {
    // Rolle mit ins User-Objekt geben!
    return { userId: payload.sub, username: payload.username, rolle: payload.rolle };
  }
}