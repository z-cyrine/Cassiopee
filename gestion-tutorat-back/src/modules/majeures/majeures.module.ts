import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Majeures } from './majeures';
import { MajorsService } from './majeures.service';
import { MajorsController } from './majeures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Majeures])],
  providers: [MajorsService],
  controllers: [MajorsController],
  exports: [MajorsService],
})
export class MajeuresModule {}
