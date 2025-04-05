import { Module } from '@nestjs/common';
import { ReportingModule } from './modules/reporting/reporting.module';  // Import ReportingModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './modules/etudiant/etudiant.entity';
import { Tuteur } from './modules/tuteur/tuteur.entity';
import { Majeures } from './modules/majeures/majeures';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtudiantService } from './services/etudiant/etudiant.service';
import { EtudiantController } from './services/etudiant/etudiant.controller';
import { ImportModule } from './services/import/import.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gestion_tutorat',
      entities: [Etudiant, Tuteur, Majeures],
      synchronize: true,
        // Ensure this is true during development
    }),    
    TypeOrmModule.forFeature([Etudiant, Tuteur, Majeures]),
    ImportModule,
    ReportingModule,  // Ensure ReportingModule is imported here
  ],
  controllers: [AppController, EtudiantController],
  providers: [AppService, EtudiantService],
})
export class AppModule {}
