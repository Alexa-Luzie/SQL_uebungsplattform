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
const child_process_1 = require("child_process");
const prisma_service_1 = require("../prisma/prisma.service");
const pg_1 = require("pg");
let DatabaseService = class DatabaseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
    cloneDatabase(templateDb, newDb) {
        const user = process.env.PGUSER || 'postgres';
        const host = process.env.PGHOST || 'localhost';
        const cmd = `createdb -U ${user} -h ${host} ${newDb} --template=${templateDb}`;
        (0, child_process_1.execSync)(cmd, { stdio: 'inherit' });
    }
    buildDbUrl(dbName) {
        const baseUrl = process.env.DATABASE_URL || '';
        return baseUrl.replace(/(database=)[^&]+/, `$1${dbName}`);
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