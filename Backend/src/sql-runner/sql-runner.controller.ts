import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { SqlRunnerService } from './sql-runner.service';

@Controller('sql')
export class SqlRunnerController {
  constructor(private readonly sqlRunnerService: SqlRunnerService) {}

  @Post('execute')
  async execute(@Body() body: { query: string; userId: string; taskId?: string; database?: string }) {
    console.log('Empfangene Anfrage:', body);

    if (!body.query || !body.userId) {
      throw new BadRequestException('Ungültige Anfrage! Felder query und userId müssen ausgefüllt sein.');
    }

    const isCorrect = body.taskId
      ? await this.sqlRunnerService.validateSubmission(body.userId, body.taskId, body.query)
      : null; // Keine Validierung, wenn taskId nicht angegeben ist

    if (!body.database) {
      throw new BadRequestException('Datenbank-ID (database) muss angegeben werden.');
    }
    const result = await this.sqlRunnerService.runQuery(body.query, body.database);

    return { result, isCorrect };
  }
}