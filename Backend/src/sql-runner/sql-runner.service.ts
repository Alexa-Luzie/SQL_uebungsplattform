import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Importiert den PrismaService, um SQL-Abfragen auszuführen


@Injectable()
export class SqlRunnerService { 
    constructor(private prisma: PrismaService) {}  // Injiziert den PrismaService
    // Der PrismaService wird verwendet, um SQL-Abfragen auszuführen und mit der Datenbank zu kommunizieren.
  async runQuery(query: string) {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  const forbidden = ['insert', 'update', 'delete', 'drop', 'alter', 'create', 'truncate'];
  const containsForbidden = forbidden.some(keyword => lower.includes(keyword));

  if (containsForbidden || !lower.startsWith('select')) {
    return {
      error: 'Nur SELECT-Abfragen sind erlaubt. Andere wie INSERT, UPDATE, DELETE, DROP usw. sind verboten.'
    };
  }

  try {
    const result = await this.prisma.$queryRawUnsafe(trimmed);
    return result;
  } catch (error) {
    return { error: error.message };
  }
}
}