import { Module } from '@nestjs/common';
import { AutoAffectationService } from './auto-affectation.service';
import { AutoAffectationController } from './auto-affectation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Majeures } from 'src/modules/majeures/majeures';
import { ExcelParserService } from 'src/services/import/excel-parser/excel-parser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Etudiant, Tuteur, Majeures]),
  ],
  providers: [AutoAffectationService, ExcelParserService],
  controllers: [AutoAffectationController]
})
export class AutoAffectationModule {}
