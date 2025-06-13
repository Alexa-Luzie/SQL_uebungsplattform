import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SqlRunnerModule } from '../sql-runner/sql-runner.module';
import { DatabaseModule } from '../database/database.module';
import { TasksModule } from '../tasks/tasks.module';
import { UploadModule } from '../upload/upload.module';
import { StudentProgressModule } from 'src/student-progress/student-progress.module'; 
import { SolutionsModule } from '../solutions/solutions.module'; // Importiert das SolutionsModule für die Lösungen

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
    SqlRunnerModule,
    DatabaseModule,  // Importiert das DatabaseModule für den Datenbankzugriff
    StudentProgressModule,
    SolutionsModule,  // Importiert das SolutionsModule für die Lösungen
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}
