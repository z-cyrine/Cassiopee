import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as url from 'url';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private casBaseUrl: string;
  private serviceUrl: string;

  constructor(private configService: ConfigService) {
    this.casBaseUrl = this.configService.get<string>('cas.url');
    this.serviceUrl = this.configService.get<string>('cas.serviceUrl');
  }

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

  async validateTicket(ticket: string, service: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const validateUrl = url.format({
        pathname: `${this.casBaseUrl}/serviceValidate`,
        query: { ticket, service },
      });

      https.get(validateUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            // Parse la réponse XML du CAS
            const user = this.parseCasResponse(data);
            if (user) {
              resolve(user);
            } else {
              reject(new HttpException('Ticket invalide', HttpStatus.UNAUTHORIZED));
            }
          } catch (error) {
            reject(new HttpException('Erreur de validation', HttpStatus.INTERNAL_SERVER_ERROR));
          }
        });
      }).on('error', (error) => {
        reject(new HttpException('Erreur de connexion au CAS', HttpStatus.SERVICE_UNAVAILABLE));
      });
    });
  }

  private parseCasResponse(xmlResponse: string): any {
    // Extraction basique du nom d'utilisateur depuis la réponse XML
    const usernameMatch = xmlResponse.match(/<cas:user>(.*?)<\/cas:user>/);
    if (usernameMatch && usernameMatch[1]) {
      return {
        username: usernameMatch[1],
        email: `${usernameMatch[1]}@imtbs-tsp.eu`,
        roles: ['USER']
      };
    }
    return null;
  }
} 