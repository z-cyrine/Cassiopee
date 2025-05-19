import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class CasService {
  private casBaseUrl = 'https://cas7d.imtbs-tsp.eu/cas';
  private serviceUrl = 'https://ea0d-157-159-39-64.ngrok-free.app/auth/cas/callback';

  constructor(private readonly httpService: HttpService) {}

  getLoginRedirectUrl(): string {
    return `${this.casBaseUrl}?service=${encodeURIComponent(this.serviceUrl)}`;
  }

  async validateTicket(ticket: string): Promise<string | null> {
    const validateUrl = `${this.casBaseUrl}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(this.serviceUrl)}`;

    const response = await lastValueFrom(this.httpService.get(validateUrl));
    const parsed = await parseStringPromise(response.data);

    const user = parsed['cas:serviceResponse']?.['cas:authenticationSuccess']?.[0]?.['cas:user']?.[0];
    return user || null;
  }
}
