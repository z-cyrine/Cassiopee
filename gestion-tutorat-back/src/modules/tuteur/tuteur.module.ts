import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { TuteurController } from 'src/services/tuteur/tuteur.controller';
import { TuteurService } from 'src/services/tuteur/tuteur.service';
=======
import { Tuteur } from './tuteur.entity';
import { TuteurService } from './tuteur.service';
import { TuteurController } from './tuteur.controller';
>>>>>>> sarra

@Module({
    imports: [TypeOrmModule.forFeature([Tuteur])],
    controllers: [TuteurController],
    providers: [TuteurService],
<<<<<<< HEAD
  })
export class TuteurModule {}
=======
    exports: [TuteurService],
})
export class TuteurModule {}
>>>>>>> sarra
