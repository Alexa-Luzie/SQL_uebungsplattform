import { Controller, Get, Patch, Param, Body, Request, UseGuards, ForbiddenException, Post, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Aktuellen Benutzer abrufen
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      rolle: user.rolle,
    };
  }

  // Alle Benutzer abrufen (nur für Admins)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Request() req) {
    console.log('DEBUG: Benutzer im Controller:', req.user); // Debugging

    if (!req.user || !req.user.rolle) {
      throw new ForbiddenException('Benutzerrolle nicht gefunden.');
    }

    if (req.user.rolle.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Nur für Admins erlaubt');
    }

    return this.usersService.findAll();
  }

  // Benutzerrolle aktualisieren (nur für Admins)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      console.log('DEBUG: Empfangene Daten:', createUserDto);
      const newUser = await this.usersService.create(createUserDto);
      console.log('DEBUG: Benutzer erfolgreich erstellt:', newUser);
      return newUser;
    } catch (error) {
      console.error('ERROR: Fehler beim Erstellen des Benutzers:', error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt')) // Authentifizierung bleibt bestehen
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id); // Entferne die Admin-Prüfung
  }
}
