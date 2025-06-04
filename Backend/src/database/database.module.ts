import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, PrismaService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
