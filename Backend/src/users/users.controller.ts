import { Controller, Get, Patch, Param, Body, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    // req.user.userId kommt aus JWT-Strategy
    const user = await this.usersService.findById(req.user.userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      rolle: user.rolle,
    };
  }

  // Alle User abrufen (nur für Admins)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (user.rolle !== 'admin') throw new ForbiddenException('Nur für Admins erlaubt');
    return this.usersService.findAll();
  }
}
