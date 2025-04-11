// etudiant.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './etudiant.entity';
import { EtudiantService } from 'src/services/etudiant/etudiant.service';
import { EtudiantController } from 'src/services/etudiant/etudiant.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Etudiant])],
    providers: [EtudiantService],
    controllers: [EtudiantController],
  })
// import { EtudiantService } from './etudiant.service';
// import { EtudiantController } from './etudiant.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Etudiant])],
  providers: [EtudiantService],
  controllers: [EtudiantController],
  exports: [EtudiantService],
})
export class EtudiantModule {}
