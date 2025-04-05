import { Module } from '@nestjs/common';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from '../etudiant/etudiant.entity';
import { Tuteur } from '../tuteur/tuteur.entity';
import { Majeures } from '../majeures/majeures';

@Module({
  imports: [TypeOrmModule.forFeature([Etudiant, Tuteur, Majeures])],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
