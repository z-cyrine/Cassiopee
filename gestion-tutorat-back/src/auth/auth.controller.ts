import { Controller, Get, Query, Res } from '@nestjs/common';
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

  @Get('cas/callback')
  casCallback(@Query('ticket') ticket: string, @Res() res: Response) {
    // Redirige vers le front avec le ticket en paramètre (à adapter selon besoin)
    return res.redirect(`http://localhost:4200?ticket=${ticket}`);
  }
} 