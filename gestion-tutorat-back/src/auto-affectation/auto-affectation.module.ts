import { Module } from '@nestjs/common';
import { AutoAffectationService } from './auto-affectation.service';
import { AutoAffectationController } from './auto-affectation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Etudiant, Tuteur]),
  ],
  providers: [AutoAffectationService],
  controllers: [AutoAffectationController]
})
export class AutoAffectationModule {}
