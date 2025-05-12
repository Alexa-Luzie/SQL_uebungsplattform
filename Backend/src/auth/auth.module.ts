import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // Benötigt, wenn man mit Benutzerdaten arbeitet
import { JwtStrategy } from './jwt.strategy'; 


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret', // JWT Secret aus der .env-Datei, supersecret ist fallback falls es nicht in der .env steht
      signOptions: { expiresIn: '1d' }, // Ablaufzeit für das JWT (1 Tag)
    }),
    UsersModule, // Falls du Benutzer mit dem UsersService benötigst
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}