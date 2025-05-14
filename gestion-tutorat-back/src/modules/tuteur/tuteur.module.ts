import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TuteurController } from './tuteur.controller';
import { TuteurService } from './tuteur.service';
import { Tuteur } from './tuteur.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tuteur])],
    controllers: [TuteurController],
    providers: [TuteurService],
    exports: [TuteurService],
  })
export class TuteurModule {}
