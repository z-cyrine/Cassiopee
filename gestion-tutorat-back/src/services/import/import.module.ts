import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ExcelParserService } from './excel-parser/excel-parser.service';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Majeures } from 'src/modules/majeures/majeures';
import { User } from 'src/modules/users/user.entity';
import { UserImportService } from 'src/modules/users/user-import.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tuteur, Etudiant, Majeures, User])],
  controllers: [ImportController],
  providers: [ImportService, ExcelParserService, UserImportService],
})
export class ImportModule {}
