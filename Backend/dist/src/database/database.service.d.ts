import { PrismaService } from '../prisma/prisma.service';
export declare class DatabaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getPostgresConnectionParams;
    importSqlToNewDatabase(sqlFilePath: string, importedDbId: string, importedDbName: string): Promise<string>;
    checkDbExists(dbName: string): Promise<boolean>;
    buildDbUrl(dbId: string): Promise<string>;
    getTemplateDbForTask(taskId: string): Promise<string>;
}
