import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EtudiantService {
    constructor(
        @InjectRepository(Etudiant)
        private readonly etudiantRepository: Repository<Etudiant>,
      ) {}

    async findAll(): Promise<Etudiant[]> {
        return this.etudiantRepository.find({ relations: ['tuteur'] }); // Includes the related Tuteur
      }
}
