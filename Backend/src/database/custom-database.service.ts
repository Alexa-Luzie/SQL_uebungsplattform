import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomDatabaseDto } from './dto/create-custom-database.dto';

@Injectable()
export class CustomDatabaseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomDatabaseDto, userId: string, userRole: string) {
    // Nur Lehrende/Tutoren/Admins dürfen anlegen
    if (!['DOZENT', 'TUTOR', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Keine Berechtigung');
    }

    try {
      // Speichere Metadaten in der Datenbank
      const db = await this.prisma.customDatabase.create({
        data: {
          name: dto.name,
          description: dto.description,
          schema: dto.schema,
          createdBy: userId,
        },
      });

      // TODO: Hier könntest du das SQL-Schema in einer echten neuen DB ausführen

      return db;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Eine Datenbank mit diesem Namen existiert bereits.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.customDatabase.findMany();
  }
}