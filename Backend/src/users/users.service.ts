
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // dein Prisma-Dienst
import { User } from '@prisma/client';

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
}