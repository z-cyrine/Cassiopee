import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

import { JWT_SECRET } from './config/jwt-secrets';

@Module({
  providers: [AuthService],
  imports: [UsersModule, JwtModule.register({
    global:true, 
    secret: JWT_SECRET,
    signOptions:{expiresIn:'1h'}
  })],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
