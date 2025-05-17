import { Body, Controller, Post, Get } from '@nestjs/common';
import { AutoAffectationService } from './auto-affectation.service';

@Controller('auto-affectation')
export class AutoAffectationController {
    constructor(private readonly autoAffectationService: AutoAffectationService) {}

    @Post()
    async runAffectation(@Body('equivalence') equivalence: number) {
      return await this.autoAffectationService.runAffectation(equivalence || 2);
    }

    @Get('etat-actuel')
    async getEtatAffectation() {
      return await this.autoAffectationService.getEtatAffectation();
    }
}
