import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { PrismaService } from '../prisma/prisma.service';

import { CustomDatabaseService } from './custom-database.service';
import { CustomDatabaseController } from './custom-database.controller';
import { ImportedDatabaseController } from './imported-database.controller';

@Module({
  controllers: [
    DatabaseController,
    CustomDatabaseController,
    ImportedDatabaseController,
  ],
  providers: [
    DatabaseService,
    CustomDatabaseService,
    PrismaService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
