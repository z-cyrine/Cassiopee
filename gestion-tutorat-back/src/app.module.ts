import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './modules/import/import.controller';
import { ImportService } from './modules/import/import.service';
import { Etudiant } from './modules/etudiant/etudiant.entity';
import { Tuteur } from './modules/tuteur/tuteur.entity';
import { ImportModule } from './modules/import/import.module';

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
    TypeOrmModule.forFeature([Etudiant, Tuteur]),
    ImportModule,
  ],
  controllers: [AppController, ImportController],
  providers: [AppService, ImportService],
})
export class AppModule {
}
