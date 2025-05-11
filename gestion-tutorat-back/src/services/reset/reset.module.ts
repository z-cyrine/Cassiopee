import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';
import { Tuteur } from '../../modules/tuteur/tuteur.entity';
import { Etudiant } from '../../modules/etudiant/etudiant.entity';
import { Majeures } from '../../modules/majeures/majeures';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tuteur, Etudiant, Majeures]),
  ],
  controllers: [ResetController],
  providers: [ResetService],
})
export class ResetModule {} 