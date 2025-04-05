import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './modules/etudiant/etudiant.entity';
import { Tuteur } from './modules/tuteur/tuteur.entity';
import { EtudiantService } from './services/etudiant/etudiant.service';
import { EtudiantController } from './services/etudiant/etudiant.controller';
import { ImportModule } from './services/import/import.module';
import { ImportController } from './services/import/import.controller';
import { ImportService } from './services/import/import.service';
import { ExcelParserService } from './services/import/excel-parser/excel-parser.service';
import { EtudiantModule } from './modules/etudiant/etudiant.module';
import { TuteurModule } from './modules/tuteur/tuteur.module';

import { AutoAffectationModule } from './auto-affectation/auto-affectation.module';
import { MajeuresModule } from './modules/majeures/majeures.module';
import { Majeures } from './modules/majeures/majeures';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gestion_tutorat', 
      //entities: [__dirname + '/**/*.entity{.ts,.js}'], // Recherche automatique des entités
      entities: [Etudiant, Tuteur, Majeures],
      synchronize: true, // Synchronisation automatique (désactiver en production)
    }),
    TypeOrmModule.forFeature([Etudiant, Tuteur, Majeures]),
    ImportModule,
    EtudiantModule,
    TuteurModule,
    AutoAffectationModule,
    MajeuresModule,
  ],
  controllers: [AppController, ImportController, EtudiantController],
  providers: [AppService, ImportService, ExcelParserService, EtudiantService],
})
export class AppModule {}
