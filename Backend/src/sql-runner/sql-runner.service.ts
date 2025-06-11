

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SqlRunnerService {
  constructor(private readonly prisma: PrismaService, private readonly databaseService: DatabaseService) {}

  async validateSubmission(userId: string, taskId: string, userAnswer: string): Promise<boolean> {
    const task = await this.prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) {
      throw new Error('Aufgabe nicht gefunden.');
    }

    const isCorrect = task.solution.trim() === userAnswer.trim();
    await this.prisma.submission.create({
      data: {
        userId,
        taskId: Number(taskId),
        answer: userAnswer,
        isCorrect,
      },
    });

    return isCorrect;
  }

  /**
   * Gibt alle Tabellen, Spalten und Inhalte der Datenbank als Objekt zurück
   * Struktur: { [tableName]: { columns: string[], rows: any[] } }
   */
  async getDatabaseStructure(dbId: string): Promise<any> {
    const databaseUrl = await this.databaseService.buildDbUrl(dbId);
    const client = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    try {
      // 1. Hole alle Tabellennamen
      const tables: Array<{ table_name: string }> = await client.$queryRawUnsafe(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`
      );
      const structure: any = {};
      for (const { table_name } of tables) {
        // 2. Hole Spaltennamen
        const columns: Array<{ column_name: string }> = await client.$queryRawUnsafe(
          `SELECT column_name FROM information_schema.columns WHERE table_name = '${table_name}';`
        );
        // 3. Hole alle Zeilen
        const rows = await client.$queryRawUnsafe(`SELECT * FROM "${table_name}"`);
        structure[table_name] = {
          columns: columns.map(c => c.column_name),
          rows
        };
      }
      return structure;
    } finally {
      await client.$disconnect();
    }
  }

  async runQuery(query: string, dbId: string): Promise<any> {
    console.log('Ausgeführte SQL-Abfrage:', query);
    const databaseUrl = await this.databaseService.buildDbUrl(dbId);
    console.log('Verwendete DB-URL:', databaseUrl);
    if (databaseUrl) {
      const customClient = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
      try {
        const result = await customClient.$queryRawUnsafe(query);
        console.log('Ergebnis der SQL-Abfrage:', result);
        return result;
      } finally {
        await customClient.$disconnect();
      }
    } else {
      const result = await this.prisma.$queryRawUnsafe(query);
      console.log('Ergebnis der SQL-Abfrage:', result);
      return result;
    }
  }
}