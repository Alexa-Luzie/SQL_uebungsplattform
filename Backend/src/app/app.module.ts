import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
<<<<<<< HEAD
import { SqlRunnerModule } from '../sql-runner/sql-runner.module';
import { DatabaseModule } from '../prisma/prisma.module'; // Importiert das DatabaseModule, um auf die Datenbank zuzugreifen
import { UbungModule } from 'src/ubung/ubung.module';
=======
import { TasksModule } from '../tasks/tasks.module';
import { UploadModule } from '../upload/upload.module';
>>>>>>> 467a4094375b376f6c3bdb9ee07b9e195aa7ea5a

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Macht es global verfügbar
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
<<<<<<< HEAD
    SqlRunnerModule,
    UbungModule,
    DatabaseModule,
=======
    TasksModule,
    UploadModule,
>>>>>>> 467a4094375b376f6c3bdb9ee07b9e195aa7ea5a
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}
