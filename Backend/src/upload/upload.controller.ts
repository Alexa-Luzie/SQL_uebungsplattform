import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { AuthGuard } from '../auth/auth.guard'; // Beispiel: Auth-Guard für Admins/Tutoren
  import { RolesGuard } from '../auth/roles.guard'; // Guard für Rollen
  import { Roles } from '../auth/roles.decorator'; // Rollen-Dekorator
  
  @Controller('upload')
  export class UploadController {
    @Post('sql')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'tutor') // Nur Admins und Tutoren dürfen hochladen
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/sql', // Speicherort für SQL-Dateien
          filename: (req, file, callback) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            callback(null, uniqueName);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.sql$/)) {
            return callback(new Error('Nur SQL-Dateien sind erlaubt!'), false);
          }
          callback(null, true);
        },
      }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      return {
        message: 'Datei erfolgreich hochgeladen',
        fileName: file.filename,
      };
    }
  }