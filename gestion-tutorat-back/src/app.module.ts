import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gestion_tutorat', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Recherche automatique des entités
      synchronize: true, // Synchronisation automatique (désactiver en production)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
