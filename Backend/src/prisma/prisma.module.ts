// src/prisma/prisma.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],

  exports: [PrismaService], // Exportiert den PrismaService, damit er in anderen Modulen verwendet werden kann
})
export class PrismaModule {}
