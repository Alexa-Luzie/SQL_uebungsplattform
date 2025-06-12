import { Controller, Get, Patch, Param, Body, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  async updateRole(@Param('id') id: string, @Body('role') role: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (user.rolle !== 'admin') {
      throw new ForbiddenException('Nur für Admins erlaubt');
    }
    return this.usersService.updateRole(id, role);
  }
}
