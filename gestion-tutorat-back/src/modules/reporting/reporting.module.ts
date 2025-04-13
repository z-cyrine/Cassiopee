import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from '../etudiant/etudiant.entity';  // Ensure Etudiant entity is imported
import { Tuteur } from '../tuteur/tuteur.entity';
import { Majeures } from '../majeures/majeures';
import { EtudiantModule } from '../etudiant/etudiant.module';  // Import EtudiantModule here

@Module({
  imports: [
    TypeOrmModule.forFeature([Etudiant, Tuteur, Majeures]),  // Ensure your repositories are available
    EtudiantModule,  // Import the Etudiant module to inject the repository into ReportingService
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
