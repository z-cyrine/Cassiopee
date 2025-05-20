import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { CasService } from './cas.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/user.service';
import * as dotenv from 'dotenv';
import { JWT_SECRET } from 'src/modules/auth/jwt/config/jwt-secrets';

dotenv.config(); 

@Controller('cas')
export class CasController {
  constructor(private readonly casService: CasService, private readonly jwtService: JwtService, private readonly userService: UserService) {}

  @Get('login')
  loginRedirect(@Res() res: Response) {
    const redirectUrl = this.casService.getLoginRedirectUrl();
    res.redirect(redirectUrl);
  }

  @Get('/validate')
  async validate(@Query('ticket') ticket: string) {
    const user = await this.casService.validateTicket(ticket);

    if (!user) throw new UnauthorizedException('Ticket CAS invalide');

    const userInDb = await this.userService.findByUsername(user.username);
    if (!userInDb) {
      throw new UnauthorizedException('Utilisateur non autorisé (username inconnu)');
    }

    const payload = {
      sub: userInDb.id,
      username: userInDb.username,
      name: userInDb.name,
      role: userInDb.role,
      email: userInDb.email,
      id: userInDb.id
    }

    const token = this.jwtService.sign(payload, {
      secret: JWT_SECRET
    });

    return {
      token,
      user: {
        id: userInDb.id,
        username: userInDb.username,
        name: userInDb.name,
        role: userInDb.role,
      }
    };
  }

}
