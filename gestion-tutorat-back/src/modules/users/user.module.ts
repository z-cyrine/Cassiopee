import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserImportService } from './user-import.service';
import { Tuteur } from '../tuteur/tuteur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tuteur])],
  providers: [UserService, UserImportService],
  exports: [UserService, UserImportService],
  controllers: [UserController], 
})
export class UsersModule {}
