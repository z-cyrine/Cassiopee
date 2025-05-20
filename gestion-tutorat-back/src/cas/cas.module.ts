import { Module } from '@nestjs/common';
import { CasService } from './cas.service';
import { CasController } from './cas.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/modules/users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    AuthModule, // ✅ maintenant tu as le JwtModule et JwtService
    HttpModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [CasController],
  providers: [CasService, UserService],
})
export class CasModule {}

