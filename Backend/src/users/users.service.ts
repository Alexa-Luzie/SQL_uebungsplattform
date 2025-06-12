import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { User, Rolle } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { email },

    });
  }

  async create(data: { email: string; name: string; password: string }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        rolle: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  // Gibt die Rolle eines Users anhand der ID zurück
  async getUserRole(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rolle: true }
    });
    return user?.rolle || null;
  }

  // Benutzerrolle aktualisieren
  async updateRole(id: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Benutzer mit ID ${id} wurde nicht gefunden.`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { rolle: role as Rolle },
    });
  }
}