import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CasService {
  private casBaseUrl = process.env.CAS_BASE_URL;
  private serviceUrl = process.env.CAS_SERVICE_URL;

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
