import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Utilisation explicite de cors
  app.use(
    cors({
      origin: 'http://localhost:4200', // Autorisez uniquement Angular
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true, // Si nécessaire
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
}
bootstrap();
