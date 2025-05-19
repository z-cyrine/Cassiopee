import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CasService } from './cas.service';
import { JwtService } from '@nestjs/jwt';

@Controller('cas')
export class CasController {
  constructor(private readonly casService: CasService, private readonly jwtService: JwtService) {}

  @Get('login')
  loginRedirect(@Res() res: Response) {
    const redirectUrl = this.casService.getLoginRedirectUrl();
    res.redirect(redirectUrl);
  }

  @Get('callback')
  async casCallback(@Query('ticket') ticket: string, @Res() res: Response) {
    const user = await this.casService.validateTicket(ticket);

    if (user) {
      // const payload = { id: user.id, username: user.username };
      // GESTION JWT à ajouter
      res.json({ success: true, user });
    } else {
      res.status(401).send('Échec de l’authentification CAS');
    }
  }
}
