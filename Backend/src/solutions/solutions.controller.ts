import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createSolution(@Body() createSolutionDto: CreateSolutionDto) {
    return this.solutionsService.createSolution(createSolutionDto);
  }
}