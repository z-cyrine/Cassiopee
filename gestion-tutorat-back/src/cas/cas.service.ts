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

  async validateTicket(ticket: string): Promise<any> {
    // console.log("hi validate");
    const validateUrl = `${this.casBaseUrl}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(this.serviceUrl)}`;
    const response = await lastValueFrom(this.httpService.get(validateUrl));
    const parsed = await parseStringPromise(response.data);

    const success = parsed['cas:serviceResponse']?.['cas:authenticationSuccess']?.[0];

    if (!success) return null;

    const user = success['cas:user']?.[0];
    const attributes = success['cas:attributes']?.[0] || {};

      // console.log('🔗 URL de validation CAS:', validateUrl);
      // console.log('📨 Réponse brute CAS:', response.data);

    return {
      username: user,
      email: attributes['cas:mail']?.[0],
      displayName: attributes['cas:displayName']?.[0],
      raw: parsed
    };



  }

}
