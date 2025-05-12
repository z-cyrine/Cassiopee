import { Controller, Get } from '@nestjs/common';
import { TuteurService } from './tuteur.service';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';

@Controller('tuteur')
export class TuteurController {
    constructor(private readonly tuteurService: TuteurService) {}
    
        @Get('all')
      async getAllEtudiants(): Promise<Tuteur[]> {
        return this.tuteurService.findAll();
      }
}
