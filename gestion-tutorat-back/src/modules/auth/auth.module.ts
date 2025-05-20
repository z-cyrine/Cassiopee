import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

import { JWT_SECRET } from './jwt/config/jwt-secrets';
import { RolesGuard } from './jwt/guards/roles.guard';
import { AuthGuard } from './jwt/guards/auth.guard';
import { JwtStrategy } from './jwt/strategy/jwt.strategy';
import { AlreadyAuthGuard } from './jwt/guards/already-auth.guard';

@Module({
  providers: [AuthService, JwtStrategy, RolesGuard, AuthGuard, AlreadyAuthGuard],
  imports: [UsersModule, JwtModule.register({
    global:true, 
    secret: JWT_SECRET,
    signOptions:{expiresIn:'1h'}
  })],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard, AuthGuard, AlreadyAuthGuard],
})
export class AuthModule {}
