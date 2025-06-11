"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pgtools = require("pgtools");
const fs = require("fs");
const pg_1 = require("pg");
const prisma_service_1 = require("../prisma/prisma.service");
const sanitize_db_name_1 = require("../utils/sanitize-db-name");
let DatabaseService = class DatabaseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getPostgresConnectionParams() {
        let user = process.env.PGUSER;
        let password = process.env.PGPASSWORD;
        let host = process.env.PGHOST;
        let port = process.env.PGPORT;
        if (!user || !password || !host || !port) {
            const dbUrl = process.env.DATABASE_URL;
            if (dbUrl) {
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
    async importSqlToNewDatabase(sqlFilePath, importedDbId, importedDbName) {
        const safeName = (0, sanitize_db_name_1.sanitizeDbName)(importedDbName);
        const dbName = `imported_${safeName}_${importedDbId}`;
        const { user, password, host, port } = this.getPostgresConnectionParams();
        await pgtools.createdb({ user, password, host, port: parseInt(port, 10) }, dbName);
        const sql = fs.readFileSync(sqlFilePath, 'utf-8');
        const client = new pg_1.Client({ user, password, host, port: parseInt(port, 10), database: dbName });
        await client.connect();
        try {
            await client.query(sql);
        }
        finally {
            await client.end();
        }
        return dbName;
    }
    async checkDbExists(dbName) {
        const client = new pg_1.Client({
            user: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD || 'postgres',
            host: process.env.PGHOST || 'localhost',
            port: parseInt(process.env.PGPORT || '5432', 10),
            database: 'postgres',
        });
        try {
            await client.connect();
            const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
            return res.rowCount > 0;
        }
        finally {
            await client.end();
        }
    }
    async buildDbUrl(dbId) {
        const baseUrl = process.env.DATABASE_URL || '';
        const importedDb = await this.prisma.importedDatabase.findUnique({ where: { id: Number(dbId) } });
        if (!importedDb) {
            throw new Error('ImportedDatabase nicht gefunden');
        }
        const safeName = (0, sanitize_db_name_1.sanitizeDbName)(importedDb.name);
        const fullDbName = `imported_${safeName}_${importedDb.id}`;
        return baseUrl.replace(/(postgres(?:ql)?:\/\/.*?:.*?@.*?:\d+\/)([^?]+)/, `$1${fullDbName}`);
    }
    async getTemplateDbForTask(taskId) {
        const task = await this.prisma.task.findUnique({ where: { id: Number(taskId) } });
        if (!task || !task.database) {
            throw new Error('Keine Datenbank-Vorlage für diese Aufgabe gefunden');
        }
        return task.database;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map