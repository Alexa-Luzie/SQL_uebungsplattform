import { Controller, Post, Body } from '@nestjs/common';  // Importiert die benötigten Module von NestJS
import { SqlRunnerService } from './sql-runner.service';  // Importiert den SqlRunnerService, um SQL-Abfragen auszuführen

@Controller('sql')
export class SqlRunnerController {
  constructor(private readonly sqlRunnerService: SqlRunnerService) {}

  @Post('execute')
  async execute(@Body() body: { query: string }) {  // Definiert den Endpunkt für die Ausführung von SQL-Abfragen
    return this.sqlRunnerService.runQuery(body.query); // Führt die SQL-Abfrage aus und gibt das Ergebnis zurück
  }
}