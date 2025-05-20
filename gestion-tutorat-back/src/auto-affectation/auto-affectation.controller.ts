import { Body, Controller, Post, Get , UseGuards} from '@nestjs/common';
import { AutoAffectationService } from './auto-affectation.service';
import { AuthGuard } from 'src/modules/auth/jwt/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/jwt/guards/roles.guard';
import { Roles } from 'src/modules/auth/jwt/decorator/roles.decorator';

@Controller('auto-affectation')
export class AutoAffectationController {
    constructor(private readonly autoAffectationService: AutoAffectationService) {}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async runAffectation(@Body('equivalence') equivalence: number) {
      return await this.autoAffectationService.runAffectation(equivalence || 2);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'consultation')
    @Get('etat-actuel')
    async getEtatAffectation() {
      return await this.autoAffectationService.getEtatAffectation();
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Post('reset')
    async resetAffectation() {
      await this.autoAffectationService.resetAffectationState();
      return { success: true };
    }
}
