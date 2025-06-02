import {Controller, Post, UploadedFile, UseInterceptors, UseGuards, Req, Get} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RolesGuard } from '../auth/roles.guard'; // Guard für Rollen
import { Roles } from '../auth/roles.decorator'; // Rollen-Dekorator
  
  @Controller('upload')
  export class UploadController {
    @Get('databases')
    async getImportedDatabases() {
      // Gibt alle importierten SQL-Datenbanken mit Usernamen zurück
      const databases = await this.prisma.importedDatabase.findMany({
        select: {
          id: true,
          name: true,
          fileName: true,
          uploadedBy: true,
        },
        orderBy: { name: 'asc' },
      });

      // Hole alle Usernamen zu den IDs
      const userIds = [...new Set(databases.map(db => db.uploadedBy))];
      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      });
      const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));

      // Füge den Namen zum Ergebnis hinzu
      return databases.map(db => ({
        ...db,
        userName: userMap[db.uploadedBy] || null,
      }));
    }
    constructor(private prisma: PrismaService) {}
    @Post('sql')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'TUTOR') // Nur Admins und Tutoren dürfen hochladen
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
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
      // Eintrag in ImportedDatabase anlegen
      // req.user.userId kommt aus JwtStrategy.validate
      const importedDb = await this.prisma.importedDatabase.create({
        data: {
          name: file.originalname,
          fileName: file.filename,
          uploadedBy: req.user.userId, // User-ID aus JWT
        },
      });
      return {
        message: 'Datei erfolgreich hochgeladen',
        fileName: file.filename,
        importedDatabaseId: importedDb.id,
      };
    }
  }