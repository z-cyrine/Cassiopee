import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import * as fs from 'fs';
import * as https from 'https';


async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // Utilisation explicite de cors
  app.use(
    cors({
      origin: [ 'https://localhost:4200', 'http://localhost:4200' ], 
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true, 
    }),
  );


app.use((req, res, next) => {
  Logger.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

  // Enable class-validator globally
  app.useGlobalPipes(new ValidationPipe());
  // Ajout du filtre d'exception global
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
  console.log(`🚀 Application NestJS en HTTPS sur https://localhost:3000`);

}
bootstrap();
