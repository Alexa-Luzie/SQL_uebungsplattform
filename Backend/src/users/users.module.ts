import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';  // PrismaModule importieren

@Module({
  imports: [PrismaModule],  // PrismaModule hier importieren
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // wichtig, falls AuthModule den Service braucht
})
export class UsersModule {}