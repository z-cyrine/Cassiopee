import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { CasService } from './cas.service';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config(); 

@Controller('cas')
export class CasController {
  constructor(private readonly casService: CasService, private readonly jwtService: JwtService) {}

  @Get('login')
  loginRedirect(@Res() res: Response) {
    const redirectUrl = this.casService.getLoginRedirectUrl();
    res.redirect(redirectUrl);
  }

  @Get('/validate')
  async validate(@Query('ticket') ticket: string) {
    const user = await this.casService.validateTicket(ticket);
    // console.log('🎟️ Ticket reçu:', ticket);
    if (user) {
      console.log('✅ Utilisateur connecté via CAS :', user);
      const token = this.jwtService.sign({
        sub: user.username,
        email: user.mail,
        name: user.displayName
      });

      return {
        token,
        user
      };
    }
    else throw new UnauthorizedException('Ticket CAS invalide');
  }

}
