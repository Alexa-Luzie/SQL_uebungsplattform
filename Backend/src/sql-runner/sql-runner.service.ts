import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SqlRunnerService {
  constructor(private readonly prisma: PrismaService) {}

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

  async runQuery(query: string): Promise<any> {
    console.log('Ausgeführte SQL-Abfrage:', query); 
    const result = await this.prisma.$queryRawUnsafe(query);
    console.log('Ergebnis der SQL-Abfrage:', result); 
    return result;
  }
}