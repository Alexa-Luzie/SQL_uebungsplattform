import { Module } from '@nestjs/common';
import { StudentProgressController } from './student-progress.controller';
import { StudentProgressService } from './student-progress.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StudentProgressController],
  providers: [StudentProgressService, PrismaService],
})
export class StudentProgressModule {}