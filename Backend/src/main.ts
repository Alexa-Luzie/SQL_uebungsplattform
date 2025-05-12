// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';  // Dein Haupt-Modul
import * as cors from 'cors';  // Optional: Falls du das 'cors' Paket verwenden möchtest 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Wenn du das cors-Paket verwendest:
  // app.use(cors());
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // entfernt unbekannte Felder aus dem Body
  forbidNonWhitelisted: true,  // gibt Fehler, wenn unbekannte Felder enthalten sind
  transform: true,              // konvertiert Payloads in DTO-Instanzen
}));                            // Aktiviert die automatische Validierung für DTOs
  // Aktivieren von CORS mit einer spezifischen Origin (deine Angular-App)
  app.enableCors({
    origin: 'http://localhost:4200',  // Die URL deiner Angular-App
    methods: 'GET,POST,PUT,DELETE,PATCH',  // Erlaubte HTTP-Methoden
    allowedHeaders: 'Content-Type, Authorization',  // Erlaubte Header
  });

  await app.listen(3000);  // NestJS hört auf Port 3000
}

bootstrap();
