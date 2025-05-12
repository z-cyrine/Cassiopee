import { Module } from '@nestjs/common';
import { AffectationManuelleController } from './affectation-manuelle.controller';
import { AffectationManuelleService } from './affectation-manuelle.service';

@Module({
  controllers: [AffectationManuelleController],
  providers: [AffectationManuelleService],
})
export class AffectationManuelleModule {}
