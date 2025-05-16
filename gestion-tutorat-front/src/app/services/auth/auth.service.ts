import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly CAS_URL = 'https://cas7d.imtbs-tsp.eu/cas';
  private readonly SERVICE_URL = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier si l'utilisateur est déjà authentifié au chargement
    this.checkAuth();
  }

  private checkAuth(): void {
    const ticket = new URLSearchParams(window.location.search).get('ticket');
    if (ticket) {
      this.validateTicket(ticket);
    } else {
      // Vérifier si on a un token en session
      const user = sessionStorage.getItem('currentUser');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  private validateTicket(ticket: string): void {
    this.http.get<any>(`${environment.apiUrl}/auth/validate-ticket`, {
      params: { ticket, service: this.SERVICE_URL }
    }).subscribe({
      next: (response) => {
        if (response.user) {
          this.setCurrentUser(response.user);
          // Rediriger vers la page d'accueil sans le ticket dans l'URL
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Erreur de validation du ticket:', error);
        this.router.navigate(['/']);
      }
    });
  }

  private setCurrentUser(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(): void {
    window.location.href = `${this.CAS_URL}/login?service=${encodeURIComponent(this.SERVICE_URL)}`;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    window.location.href = `${this.CAS_URL}/logout?service=${encodeURIComponent(this.SERVICE_URL)}`;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.roles.includes(role) || false;
  }
} 