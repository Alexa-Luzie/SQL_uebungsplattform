import { Injectable } from '@nestjs/common';
import * as pgtools from 'pgtools';
import * as fs from 'fs';
import { Client } from 'pg';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeDbName } from '../utils/sanitize-db-name';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Hilfsfunktion: Wandelt einen Namen in ein sicheres DB-Schema um (nur Buchstaben, Zahlen, Unterstriche)
   * Ersetzt alle nicht-alphanumerischen Zeichen durch _
   */

  // Entfernt, stattdessen Hilfsfunktion aus utils

  /**
   * Importiert eine SQL-Datei in eine neu erstellte PostgreSQL-Datenbank.
   * @param sqlFilePath Pfad zur SQL-Datei
   * @param importedDbId Eindeutige ID für die neue Datenbank
   * @returns Name der neuen Datenbank
   */
  
  /**
   * Extrahiert Verbindungsdaten für PostgreSQL aus Umgebungsvariablen oder DATABASE_URL
   */
  private getPostgresConnectionParams() {
    let user = process.env.PGUSER;
    let password = process.env.PGPASSWORD;
    let host = process.env.PGHOST;
    let port = process.env.PGPORT;

    if (!user || !password || !host || !port) {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        // postgresql://user:pass@host:port/db
        const match = dbUrl.match(/^postgres(?:ql)?:\/\/(.*?):(.*?)@(.*?):(\d+)\//);
        if (match) {
          user = user || match[1];
          password = password || match[2];
          host = host || match[3];
          port = port || match[4];
        }
      }
    }
    return {
      user: user || 'postgres',
      password: password || 'postgres',
      host: host || 'localhost',
      port: port || '5432',
    };
  }

  async importSqlToNewDatabase(sqlFilePath: string, importedDbId: string, importedDbName: string): Promise<string> {
    // Namensschema einer Datenbank: imported_<name>_<ID> (Name wird sanitisiert)
    const safeName = sanitizeDbName(importedDbName);
    const dbName = `imported_${safeName}_${importedDbId}`;
    const { user, password, host, port } = this.getPostgresConnectionParams();

    // 1. Neue Datenbank anlegen mit pgtools
    await pgtools.createdb({ user, password, host, port: parseInt(port, 10) }, dbName);

    // 2. SQL-Datei importieren: Datei einlesen und Statements ausführen
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');
    const client = new Client({ user, password, host, port: parseInt(port, 10), database: dbName });
    await client.connect();
    try {
      // Achtung: Für große oder komplexe Dumps ggf. anpassen!
      await client.query(sql);
    } finally {
      await client.end();
    }
    return dbName;
  }

  // Prüft, ob eine Datenbank existiert (Postgres) kann Vorlagen DB prüfen und Kopien       FUNKTION MUSS ÜBERARBEITET WERDEN
  async checkDbExists(dbName: string): Promise<boolean> {

    // Verbindet sich mit der postgres-Meta-DB und prüft, ob die DB existiert
    const client = new Client({
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      database: 'postgres',
    });
    
    try {
      await client.connect();
      const res = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );
      return (res.rowCount ?? 0) > 0;
    } finally {
      await client.end();
    }
  }

  /* Klont eine Datenbank (Postgres, via Shell)         MUSS ÜBERARBEITET WERDEN
  cloneDatabase(templateDb: string, newDb: string) {
    const user = process.env.PGUSER || 'postgres';
    const host = process.env.PGHOST || 'localhost';
    const cmd = `createdb -U ${user} -h ${host} ${newDb} --template=${templateDb}`;
    execSync(cmd, { stdio: 'inherit' });
  }
  */

// Baut die DB-URL für Prisma      WIRD UMBEDINGT FÜR SQL SKRIPTS BENÖTIGT UM SIE AUF DER RICHTIGEN DATENBANK AUSZUFÜHREN
  /**
   * Baut die DB-URL für Prisma anhand des gewünschten Datenbank-Namensschemas
   * @param dbId Die ID der Datenbank (z.B. aus ImportedDatabase.id)
   * @param dbName Der Name der Datenbank (z.B. aus ImportedDatabase.name)
   * @returns Vollständige DB-URL für Prisma
   */


  /**
   * Baut die DB-URL für Prisma anhand der ImportedDatabase-ID
   * Sucht den Namen in der Tabelle ImportedDatabase und baut daraus den DB-Namen
   */
  async buildDbUrl(dbId: string): Promise<string> {
    const baseUrl = process.env.DATABASE_URL || '';

    // 1. Zuerst nach importierter DB suchen
    let importedDb = await this.prisma.importedDatabase.findUnique({ where: { id: Number(dbId) } });
    if (importedDb) {
      const safeName = sanitizeDbName(importedDb.name);
      const fullDbName = `imported_${safeName}_${importedDb.id}`;
      return baseUrl.replace(/(postgres(?:ql)?:\/\/.*?:.*?@.*?:\d+\/)([^?]+)/, `$1${fullDbName}`);
    }

    // 2. Dann nach eigener (custom) DB suchen
    let customDb = await this.prisma.customDatabase.findUnique({ where: { id: Number(dbId) } });
    if (customDb) {
      const safeName = sanitizeDbName(customDb.name);
      const fullDbName = `custom_${safeName}_${customDb.id}`;
      return baseUrl.replace(/(postgres(?:ql)?:\/\/.*?:.*?@.*?:\d+\/)([^?]+)/, `$1${fullDbName}`);
    }

    throw new Error('Datenbank nicht gefunden');
  }

  // FUNKTION MUSS AUF KOREKKTHEIT ÜBERPRÜFT WERDEN    Holt die Vorlage-Datenbank einer Aufgabe aus der Datenbank (Task.database)       auf Vorlagen DB werden keine Queries ausgeführt     
  async getTemplateDbForTask(taskId: string): Promise<string> {                          
    const task = await this.prisma.task.findUnique({ where: { id: Number(taskId) } });                
    if (!task || !task.database) {
      throw new Error('Keine Datenbank-Vorlage für diese Aufgabe gefunden');
    }
    return task.database;
  }
}
