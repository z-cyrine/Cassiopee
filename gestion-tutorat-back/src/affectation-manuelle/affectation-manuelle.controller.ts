import { Body, Controller, Post } from '@nestjs/common';
import { AffectationManuelleService } from './affectation-manuelle.service';

@Controller('affectation-manuelle')
export class AffectationManuelleController {
  constructor(private readonly affectationService: AffectationManuelleService) {}

  @Post()
  async affecter(@Body() body: { etudiantId: number; tuteurId: number }) {
    const { etudiantId, tuteurId } = body;
    return this.affectationService.affecterEtudiant(etudiantId, tuteurId);
  }
}