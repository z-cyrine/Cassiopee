import { Controller, Get, Query, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Get('login')
  async login(@Query('service') service: string, @Res() res: Response) {
    const loginUrl = this.authService.getLoginUrl(service);
    res.redirect(loginUrl);
  }

  @Get('validate')
  async validateTicket(
    @Query('ticket') ticket: string,
    @Query('service') service: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.validateTicket(ticket, service);
      // Générer un JWT ici
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      res.json({ success: true, user, token });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid ticket' });
    }
  }

  @Get('logout')
  async logout(@Query('service') service: string, @Res() res: Response) {
    const logoutUrl = this.authService.getLogoutUrl(service);
    res.redirect(logoutUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
} 