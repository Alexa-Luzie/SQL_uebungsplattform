import { Controller, Get, UseGuards } from '@nestjs/common';
import { StudentProgressService } from './student-progress.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('student-progress')
@UseGuards(AuthGuard, RolesGuard)
export class StudentProgressController {
  constructor(private readonly studentProgressService: StudentProgressService) {}

  @Get()
  @Roles('TUTOR', 'DOZENT', 'ADMIN')
  async getAllStudentProgress() {
    return this.studentProgressService.getAllStudentProgress();
  }
}