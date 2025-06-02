import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentProgressService {
  constructor(private prisma: PrismaService) {}

  async getAllStudentProgress() {
    // Hole alle Studenten
    const students = await this.prisma.user.findMany({
      where: { rolle: 'STUDENT' },
      select: { id: true, name: true, email: true }
    });

    // Hole alle Aufgaben
    const tasks = await this.prisma.task.findMany();

    // Hole alle Abgaben (Submissions)
    // Passe den Tabellennamen und die Felder ggf. an dein Modell an!
    const submissions = await this.prisma.submission.findMany();

    // Berechne Fortschritt pro Student
    return students.map(student => {
      const studentSubs = submissions.filter(s => s.userId === student.id);
      const tasksSolved = new Set(studentSubs.filter(s => s.isCorrect).map(s => s.taskId)).size;
      const errors = studentSubs.filter(s => !s.isCorrect).length;
      return {
        student,
        tasksTotal: tasks.length,
        tasksSolved,
        errors
      };
    });
  }
}