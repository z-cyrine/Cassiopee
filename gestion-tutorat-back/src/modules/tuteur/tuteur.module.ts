import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { TuteurController } from 'src/services/tuteur/tuteur.controller';
import { TuteurService } from 'src/services/tuteur/tuteur.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tuteur])],
    controllers: [TuteurController],
    providers: [TuteurService],
  })
export class TuteurModule {}