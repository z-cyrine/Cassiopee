import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Gestion Tutorat')
  .setDescription('API pour la gestion des tutorats')
  .setVersion('1.0')
  .addTag('Import', 'Endpoints pour l\'import des données')
  .addTag('Tutorat', 'Endpoints pour la gestion des tutorats')
  .addTag('Majeures', 'Endpoints pour la gestion des majeures')
  .addBearerAuth()
  .build(); 