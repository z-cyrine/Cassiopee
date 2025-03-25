import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ExcelParserService } from './excel-parser/excel-parser.service';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Majeures } from 'src/modules/majeures/majeures';

@Module({
  imports: [TypeOrmModule.forFeature([Tuteur, Etudiant, Majeures])],
  controllers: [ImportController],
  providers: [ImportService, ExcelParserService],
})
export class ImportModule {}
