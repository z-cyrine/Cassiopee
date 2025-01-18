import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuteur } from 'src/entities/tuteur.entity';

@Module({  
    imports: [TypeOrmModule.forFeature([Tuteur])],
})
export class TuteurModule {}
