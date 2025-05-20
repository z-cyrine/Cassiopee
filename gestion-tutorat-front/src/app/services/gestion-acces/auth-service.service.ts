import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload.role);
    return payload.role || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setAuthenticated(value: boolean) {
    this.authState.next(value);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.updateAuthStatus();
  }

  updateAuthStatus() {
    this.authStatus.next(this.hasToken());
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      return null;
    }
  }
}
