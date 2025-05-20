// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { JWT_SECRET } from '../config/jwt-secrets';

// @Injectable()
// export class AuthGuard implements CanActivate{
//     constructor(private jwtService: JwtService) {}

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authHeader = request.headers['authorization'];

//     if (!authHeader) {
//         throw new UnauthorizedException('Token not found');
//     }

//     const token = authHeader.split(' ')[1];
//     return this.jwtService.verifyAsync(token, {
//             secret: JWT_SECRET
//         })
//         .then(() => true)
//         .catch(() => {
//         throw new UnauthorizedException('Invalid token');
//         });
//     }

// }


import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {}
