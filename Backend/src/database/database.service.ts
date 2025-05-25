import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { PrismaService } from '../prisma/prisma.service';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  // Prüft, ob eine Datenbank existiert (Postgres) kann Vorlagen DB prüfen und Kopien 
  async checkDbExists(dbName: string): Promise<boolean> {

    // Verbindet sich mit der postgres-Meta-DB und prüft, ob die DB existiert
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      database: 'postgres', // immer auf die Meta-DB verbinden
    });
    await client.connect();
    try {
      const res = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );
      return res.rowCount > 0;
    } finally {
      await client.end();
    }
  }

  // Klont eine Datenbank (Postgres, via Shell)
  cloneDatabase(templateDb: string, newDb: string) {
    const user = process.env.PGUSER || 'postgres';
    const host = process.env.PGHOST || 'localhost';
    const cmd = `createdb -U ${user} -h ${host} ${newDb} --template=${templateDb}`;
    execSync(cmd, { stdio: 'inherit' });
  }

  // Baut die DB-URL für Prisma
  buildDbUrl(dbName: string): string {
    const baseUrl = process.env.DATABASE_URL || '';
    return baseUrl.replace(/(database=)[^&]+/, `$1${dbName}`);
  }

  // Holt die Vorlage-Datenbank einer Aufgabe aus der Datenbank (Task.database)       auf Vorlagen DB werden keine Queries ausgeführt
  async getTemplateDbForTask(taskId: string): Promise<string> {                          
    const task = await this.prisma.task.findUnique({ where: { id: Number(taskId) } });                //WICHTIG Irgendwo muss sichergestellt werden das die Datenbanken zu den Tasks importiert wurden bzw. auch richtig gefüllt sind
    if (!task || !task.database) {
      throw new Error('Keine Datenbank-Vorlage für diese Aufgabe gefunden');
    }
    return task.database;
  }
}
