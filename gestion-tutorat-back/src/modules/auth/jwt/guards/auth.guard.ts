import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization ? authorization.split(' ')[1] : null;

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            await this.jwtService.verifyAsync(token);
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

    }
}