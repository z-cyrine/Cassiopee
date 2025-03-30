import { Body, Controller, Post } from '@nestjs/common';
import { AutoAffectationService } from './auto-affectation.service';

@Controller('auto-affectation')
export class AutoAffectationController {
    constructor(private readonly autoAffectationService: AutoAffectationService) {}

    @Post()
    async runAffectation(@Body('equivalence') equivalence: number) {
      return await this.autoAffectationService.runAffectation(equivalence || 2);
    }
}
