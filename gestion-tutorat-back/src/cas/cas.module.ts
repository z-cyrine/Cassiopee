import { Module } from '@nestjs/common';
import { CasService } from './cas.service';
import { CasController } from './cas.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CasController],
  providers: [CasService],
})
export class CasModule {}
