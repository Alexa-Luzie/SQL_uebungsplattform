import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const existingUser = await this.usersService.findByEmail(registerDto.email);
      if (existingUser) {
        console.warn(`Registrierung fehlgeschlagen: E-Mail ${registerDto.email} bereits registriert`);
        throw new ConflictException('E-Mail-Adresse ist bereits registriert');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.usersService.create({
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
      });

      console.log(`Registrierung erfolgreich: ${user.email}`);
      return { ...user, name: user.name ?? '' } as User;
    } catch (error) {
      console.error('Fehler beim Registrieren:', error);

      if (error.code === '23505') { // PostgreSQL spezifischer Fehlercode
        throw new ConflictException('E-Mail-Adresse ist bereits registriert');
      }

      throw new InternalServerErrorException('Registrierung fehlgeschlagen');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) {
        console.warn(`Login fehlgeschlagen: Benutzer nicht gefunden (${dto.email})`);
        throw new UnauthorizedException('Ungültige E-Mail oder Passwort.');
      }

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        console.warn(`Login fehlgeschlagen: Ungültiges Passwort (${dto.email})`);
        throw new UnauthorizedException('Ungültige E-Mail oder Passwort.');
      }

    const payload = { sub: user.id, email: user.email, name: user.name, rolle: user.rolle };
    const token = this.jwtService.sign(payload);

      console.log(`Login erfolgreich für Benutzer: ${dto.email}`);
      return { access_token: token };
    } catch (error) {
      console.error('Fehler beim Login:', error);
      throw error;
    }
  }
}