import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './etudiant.entity';
import { EtudiantService } from './etudiant.service';
import { EtudiantController } from './etudiant.controller';
import { Majeures } from '../majeures/majeures';

@Module({
    imports: [TypeOrmModule.forFeature([Etudiant, Majeures])],
    providers: [EtudiantService],
    controllers: [EtudiantController],
  })

export class EtudiantModule {}
