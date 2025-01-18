import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from '@nestjs/common';

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


  await app.listen(3000);
}
bootstrap();
