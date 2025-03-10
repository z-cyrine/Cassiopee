import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './etudiant.entity';
import { EtudiantService } from './etudiant.service';
import { EtudiantController } from './etudiant.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Etudiant])],
    controllers: [EtudiantController],
    providers: [EtudiantService],

})
export class EtudiantModule {}
