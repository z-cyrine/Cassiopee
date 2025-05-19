import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CAS from 'cas-authentication';

@Injectable()
export class AuthService {
  private cas: any;

  constructor(private configService: ConfigService) {
    this.cas = new CAS({
      cas_url: 'https://cas7d.imtbs-tsp.eu/cas',
      service_url: this.configService.get<string>('CAS_SERVICE_URL'),
      cas_version: '3.0',
    });
  }

  async validateTicket(ticket: string, service: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cas.validate(ticket, service, (err: any, status: any, username: string) => {
        if (err) {
          reject(new UnauthorizedException('Invalid CAS ticket'));
        }
        if (status) {
          resolve({ username });
        } else {
          reject(new UnauthorizedException('Invalid CAS ticket'));
        }
      });
    });
  }

  getLoginUrl(service: string): string {
    return this.cas.getLoginUrl(service);
  }

  getLogoutUrl(service: string): string {
    return this.cas.getLogoutUrl(service);
  }
} 