import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSolutionDto } from './dto/create-solution.dto';

@Injectable()
export class SolutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSolution(createSolutionDto: CreateSolutionDto) {
    const { taskId, userId, solutionQuery, isCorrect } = createSolutionDto;

    return this.prisma.solution.create({
      data: {
        taskId: Number(taskId),
        userId,
        solutionQuery,
        isCorrect,
      },
    });
  }
}