import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuteur } from './tuteur.entity';
import { TuteurService } from './tuteur.service';
import { TuteurController } from './tuteur.controller';

@Module({  
    imports: [TypeOrmModule.forFeature([Tuteur])],
    controllers: [TuteurController],
    providers: [TuteurService],
    exports: [TuteurService],
})
export class TuteurModule {}
