import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';

@Module({  
    imports: [TypeOrmModule.forFeature([Tuteur])],
})
export class TuteurModule {}
