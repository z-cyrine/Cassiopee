import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  login(@Res() res: Response) {
    return res.redirect(this.authService.getLoginUrl());
  }

  @Get('logout')
  logout(@Res() res: Response) {
    return res.redirect(this.authService.getLogoutUrl());
  }

  @Get('validate-ticket')
  async validateTicket(@Query('ticket') ticket: string, @Query('service') service: string) {
    try {
      const user = await this.authService.validateTicket(ticket, service);
      if (!user) {
        throw new HttpException('Ticket invalide', HttpStatus.UNAUTHORIZED);
      }
      return { user };
    } catch (error) {
      throw new HttpException('Erreur de validation du ticket', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('cas/callback')
  casCallback(@Query('ticket') ticket: string, @Res() res: Response) {
    if (!ticket) {
      return res.redirect('https://localhost:4200?error=no_ticket');
    }
    return res.redirect(`https://localhost:4200?ticket=${ticket}`);
  }
} 