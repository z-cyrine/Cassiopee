import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { JWT_SECRET } from '../config/jwt-secrets';

@Injectable()
export class AlreadyAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return true;

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
      console.log('🚫 Already connected as:', payload);
      throw new ForbiddenException('Vous êtes déjà connecté');
    } catch {
      return true;
    }
  }
}
