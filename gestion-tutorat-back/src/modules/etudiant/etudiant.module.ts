import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './etudiant.entity';
import { EtudiantService } from 'src/etudiant/etudiant.service';
import { EtudiantController } from 'src/etudiant/etudiant.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Etudiant])],
    providers: [EtudiantService],
    controllers: [EtudiantController],
  })
export class EtudiantModule {}
