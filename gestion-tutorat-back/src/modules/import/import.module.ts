import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuteur } from '../tuteur/tuteur.entity';
import { Etudiant } from '../etudiant/etudiant.entity';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ExcelParserService } from './excel-parser/excel-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tuteur, Etudiant])],
  controllers: [ImportController],
  providers: [ImportService, ExcelParserService],
})
export class ImportModule {}
