import { Injectable } from '@nestjs/common';
import * as url from 'url';

@Injectable()
export class AuthService {
  private casBaseUrl = 'https://cas7d.imtbs-tsp.eu/cas';
  private serviceUrl = 'http://localhost:8080/';
  getLoginUrl(): string {
    return url.format({
      pathname: `${this.casBaseUrl}/login`,
      query: { service: this.serviceUrl },
    });
  }

  getLogoutUrl(): string {
    return url.format({
      pathname: `${this.casBaseUrl}/logout`,
      query: { service: this.serviceUrl },
    });
  }
} 