import { Controller, Get } from '@nestjs/common';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { EtudiantService } from './etudiant.service';

@Controller('etudiants')
export class EtudiantController {
    constructor(private readonly etudiantService: EtudiantService) {}

    @Get('all')
  async getAllEtudiants(): Promise<Etudiant[]> {
    return this.etudiantService.findAll();
  }
  
}
