
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

  async runQuery(query: string, dbId: string): Promise<any> {
    console.log('Ausgeführte SQL-Abfrage:', query);
    const databaseUrl = await this.databaseService.buildDbUrl(dbId);
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