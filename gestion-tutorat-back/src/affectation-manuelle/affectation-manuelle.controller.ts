import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/jwt/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/jwt/guards/roles.guard';
import { Roles } from 'src/modules/auth/jwt/decorator/roles.decorator';

import { AffectationManuelleService } from './affectation-manuelle.service';

@Controller('affectation-manuelle')
export class AffectationManuelleController {
  constructor(private readonly affectationService: AffectationManuelleService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async affecter(@Body() body: { etudiantId: number; tuteurId: number }) {
    const { etudiantId, tuteurId } = body;
    return this.affectationService.affecterEtudiant(etudiantId, tuteurId);
  }
}