import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Macht es global verfügbar
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TasksModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}
