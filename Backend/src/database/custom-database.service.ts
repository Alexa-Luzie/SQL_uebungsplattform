import { Injectable, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomDatabaseDto } from './dto/create-custom-database.dto';
import { Client } from 'pg';

function sanitizeDbName(name: string) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

@Injectable()
export class CustomDatabaseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomDatabaseDto, userId: string, userRole: string) {
    // Nur Lehrende/Tutoren/Admins dürfen anlegen
    if (!['DOZENT', 'TUTOR', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Keine Berechtigung');
    }

    try {
      // 1. Metadaten speichern
      const db = await this.prisma.customDatabase.create({
        data: {
          name: dto.name,
          description: dto.description,
          schema: dto.schema,
          createdBy: userId,
        },
      });

      // 2. Echte Datenbank in Postgres anlegen
      const safeName = sanitizeDbName(dto.name);
      const dbName = `custom_${safeName}_${db.id}`;
      console.log('Versuche Datenbank anzulegen:', dbName);

      try {
        await this.prisma.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
        console.log('CREATE DATABASE erfolgreich:', dbName);
      } catch (err: any) {
        // Fehlerbehandlung: Existiert die DB schon?
        if (err.message && err.message.includes('already exists')) {
          console.warn(`Datenbank ${dbName} existiert bereits.`);
        } else if (err.message && err.message.includes('permission denied')) {
          throw new InternalServerErrorException('PostgreSQL-User hat keine CREATEDB-Rechte!');
        } else {
          console.error('Fehler beim CREATE DATABASE:', err);
          throw new InternalServerErrorException('Fehler beim Anlegen der Datenbank: ' + err.message);
        }
      }

      // 3. Optional: Schema importieren, falls angegeben
      if (dto.schema && dto.schema.trim().length > 0) {
        const baseUrl = process.env.DATABASE_URL || '';
        const dbUrl = baseUrl.replace(/(postgres(?:ql)?:\/\/.*?:.*?@.*?:\d+\/)([^?]+)/, `$1${dbName}`);
        const client = new Client({ connectionString: dbUrl });
        await client.connect();
        try {
          await client.query(dto.schema);
          console.log('Schema erfolgreich importiert in:', dbName);
        } catch (err) {
          console.error('Fehler beim Importieren des Schemas:', err);
          throw new InternalServerErrorException('Fehler beim Importieren des Schemas: ' + err.message);
        } finally {
          await client.end();
        }
      }

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

  async remove(id: number) {
    // 1. Hole den DB-Namen
    const db = await this.prisma.customDatabase.findUnique({ where: { id } });
    if (!db) throw new Error('CustomDatabase not found');
    const safeName = sanitizeDbName(db.name);
    const dbName = `custom_${safeName}_${db.id}`;

    // 2. Lösche die echte Datenbank in PostgreSQL
    await this.prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS "${dbName}"`);

    // 3. Lösche den Eintrag aus der Tabelle
    return this.prisma.customDatabase.delete({ where: { id } });
  }
}