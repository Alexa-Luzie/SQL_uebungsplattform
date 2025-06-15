import { Controller, Post, Body, Req, Get, Delete, Param } from '@nestjs/common';
import { CustomDatabaseService } from './custom-database.service';
import { CreateCustomDatabaseDto } from './dto/create-custom-database.dto';

@Controller('custom-databases')
export class CustomDatabaseController {
  constructor(private readonly service: CustomDatabaseService) {}

  @Post()
  async create(@Body() dto: CreateCustomDatabaseDto, @Req() req: any) {
    const userId = req.user?.id || 'test-user';
    const userRole = req.user?.rolle || 'DOZENT';
    return this.service.create(dto, userId, userRole);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}