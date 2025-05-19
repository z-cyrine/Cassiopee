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
  private readonly SERVICE_URL = window.location.origin + '/auth/callback';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuth();
  }

  private checkAuth(): void {
    const ticket = new URLSearchParams(window.location.search).get('ticket');
    if (ticket) {
      // Laissez le composant callback gérer la validation
    } else {
      const user = sessionStorage.getItem('currentUser');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  public validateTicket(ticket: string, service: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/auth/validate`, {
      params: { ticket, service }
    }).pipe(
      tap(response => {
        if (response.user && response.token) {
          this.setCurrentUser(response.user);
          localStorage.setItem('jwt', response.token);
        }
      })
    );
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