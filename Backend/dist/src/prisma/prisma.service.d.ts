import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient {
    private _submission;
    get submission(): any;
    set submission(value: any);
    enableShutdownHooks(app: INestApplication): Promise<void>;
}
