import { Module } from '@nestjs/common';
import { CasService } from './cas.service';
import { CasController } from './cas.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from 'src/modules/auth/config/jwt-secrets';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule],
  controllers: [CasController],
  providers: [CasService],
})
export class CasModule {}
