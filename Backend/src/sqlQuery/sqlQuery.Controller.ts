


import { Controller, Post, Body, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { SqlQueryService } from './sqlQuery.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('sql-query')
export class SqlQueryController {
  constructor(private readonly sqlQueryService: SqlQueryService) {}

  @Post('execute')
  @UseGuards(AuthGuard('jwt')) // Nur für eingeloggte User
  async executeSql(
    @Body('query') query: string,
    @Body('taskId') taskId: string,
    @Request() req
  ) {
    if (!query || typeof query !== 'string' || !query.trim().toLowerCase().startsWith('select')) {
      throw new BadRequestException('Nur SELECT-Statements sind erlaubt.');
    }
    if (!taskId || typeof taskId !== 'string') {
      throw new BadRequestException('taskId ist erforderlich.');
    }
    // Die Prüfung und ggf. das Anlegen der User-DB übernimmt der Service
    return this.sqlQueryService.execute(query, req.user.userId, taskId);
  }
}
