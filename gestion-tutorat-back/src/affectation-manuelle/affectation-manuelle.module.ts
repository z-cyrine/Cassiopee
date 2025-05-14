import { Module } from '@nestjs/common';
import { AffectationManuelleController } from './affectation-manuelle.controller';
import { AffectationManuelleService } from './affectation-manuelle.service';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tuteur, Etudiant])],
  controllers: [AffectationManuelleController],
  providers: [AffectationManuelleService],
})
export class AffectationManuelleModule {}
