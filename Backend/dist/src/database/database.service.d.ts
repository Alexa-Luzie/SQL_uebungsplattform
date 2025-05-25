import { PrismaService } from '../prisma/prisma.service';
export declare class DatabaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkDbExists(dbName: string): Promise<boolean>;
    cloneDatabase(templateDb: string, newDb: string): void;
    buildDbUrl(dbName: string): string;
    getTemplateDbForTask(taskId: string): Promise<string>;
}
