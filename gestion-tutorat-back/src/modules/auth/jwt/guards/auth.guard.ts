import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../config/jwt-secrets';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    console.log('🔐 Reçu dans le guard - Authorization :', authHeader);

    if (!authHeader) {
        throw new UnauthorizedException('Token not found');
    }

    console.log('🧪 Clé utilisée pour SIGNER :', JWT_SECRET);
    const token = authHeader.split(' ')[1];
    return this.jwtService.verifyAsync(token, {
            secret: JWT_SECRET
        })
        .then(() => true)
        .catch(() => {
        throw new UnauthorizedException('Invalid token');
        });
    }

}