import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TuteurService {

    constructor(
            @InjectRepository(Tuteur)
            private readonly tuteurRepository: Repository<Tuteur>,
          ) {}
    
        async findAll(): Promise<Tuteur[]> {
            return this.tuteurRepository.find();
          }
          
}
