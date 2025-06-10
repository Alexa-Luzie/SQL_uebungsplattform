import { Module } from '@nestjs/common';
import { SqlRunnerController } from './sql-runner.controller';
import { SqlRunnerService } from './sql-runner.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [PrismaModule, DatabaseModule],
  controllers: [SqlRunnerController],
  providers: [SqlRunnerService],
})
export class SqlRunnerModule {}
