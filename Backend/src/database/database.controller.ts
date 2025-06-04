import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('database')
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly prisma: PrismaService,
  ) {}

  // Beispiel-Endpunkt: Prüft, ob eine Datenbank existiert        MUSS ÜBERARBEITET WERDEN
  @Get('exists/:dbName')
  async checkDbExists(@Param('dbName') dbName: string) {
    const exists = await this.databaseService.checkDbExists(dbName);
    return { dbName, exists };
  }

  // Beispiel-Endpunkt: Holt die Vorlage-Datenbank einer Aufgabe    MUSS ÜBERARBEITET WERDEN
  @Get('template')
  async getTemplateDbForTask(@Query('taskId') taskId: string) {
    const db = await this.databaseService.getTemplateDbForTask(taskId);
    return { taskId, db };
  }

  // Legt eine neue Datenbank zu einer importierten Datei an            //Datei muss in PostgreSQL-Format sein und nicht MySQL-Syntax
  @Get('import/:importedDbId')
  async createDbFromImport(@Param('importedDbId') importedDbId: string) {
    // Hole den Import-Eintrag inkl. Pfad, Name und created-Status
    const importedDb = await this.prisma.importedDatabase.findUnique({
      where: { id: Number(importedDbId) },
    });
    if (!importedDb) {
      return { error: 'Importierte Datei nicht gefunden' };
    }
    if (importedDb.created) {
      return { error: 'Für diesen Import wurde bereits eine Datenbank erstellt', dbName: `imported_${importedDb.name}_${importedDb.id}` };
    }
    // Importiere die SQL-Datei in eine neue Datenbank mit gewünschtem Namensschema
    const dbName = await this.databaseService.importSqlToNewDatabase(importedDb.path, importedDbId, importedDb.name);
    // Setze created auf true
    await this.prisma.importedDatabase.update({
      where: { id: Number(importedDbId) },
      data: { created: true },
    });
    return { importedDbId, dbName };
  }
}
