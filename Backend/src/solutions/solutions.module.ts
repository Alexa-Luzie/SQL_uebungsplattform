import { Module } from '@nestjs/common';
import { SolutionsController } from './solutions.controller';
import { SolutionsService } from './solutions.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SolutionsController],
  providers: [SolutionsService, PrismaService],
})
export class SolutionsModule {}