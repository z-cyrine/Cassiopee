import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from 'src/entities/etudiant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Etudiant])],

})
export class EtudiantModule {}
