import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // Erstelle diese Datei, um den Payload zu definieren

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrahiert das Token aus dem Authorization Header
      secretOrKey: process.env.JWT_SECRET || 'supersecret', // Secret für das JWT
    });
  }

  async validate(payload: JwtPayload) {
    // Hier kannst du den Payload überprüfen, z.B. die Benutzer-ID oder andere Informationen
    return { userId: payload.sub, email: payload.email, rolle: payload.rolle, name: payload.name };
  }
}
