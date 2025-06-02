import { PrismaService } from '../prisma/prisma.service';
import { DatabaseService } from '../database/database.service';
export declare class SqlQueryService {
    private readonly databaseService;
    private readonly prisma;
    constructor(databaseService: DatabaseService, prisma: PrismaService);
    execute(query: string, userId: string, taskId: string): Promise<any>;
    validateSubmission(userId: string, taskId: string, userAnswer: string): Promise<boolean>;
}
