import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SqlQueryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly prisma: PrismaService
  ) {}




  /**
   * Für Aufgaben mit derselben Vorlage wird nur eine User-Kopie erstellt und wiederverwendet.
   * @param query SQL-Statement (nur SELECT erlaubt, wird im Controller geprüft)
   * @param userId ID des Users, der die Abfrage ausführt
   * @param taskId ID der Aufgabe (um die richtige Vorlage zu finden)
   */

  //Führt ein SQL-Query für einen bestimmten User auf einer Kopie der Vorlagen-Datenbank aus.
  async execute(query: string, userId: string, taskId: string): Promise<any> {

    // 1. Mapping: Ermittle die Vorlage-DB zu dieser Aufgabe
    const templateDb = await this.databaseService.getTemplateDbForTask(taskId);  

    // 2. User-DB-Name: Nur eine Kopie pro User und Vorlage
    const userDb = `db_${templateDb}_user_${userId}`;                            


    // 3. Prüfen, ob die Vorlage-Datenbank existiert
    if (!await this.databaseService.checkDbExists(templateDb)) {
      throw new Error(`Vorlagen-Datenbank ${templateDb} existiert nicht!`);
    }

    // 4. Prüfen, ob User-DB existiert, sonst anlegen
    if (!await this.databaseService.checkDbExists(userDb)) {
      this.databaseService.cloneDatabase(templateDb, userDb);
    }

    // 5. Mit Prisma auf die User-DB verbinden
    const dbUrl = this.databaseService.buildDbUrl(userDb);
    const userPrisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
    try {
      return await userPrisma.$queryRawUnsafe(query);
    } finally {
      await userPrisma.$disconnect();
    }
  }
}
