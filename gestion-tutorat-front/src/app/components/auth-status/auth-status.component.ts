import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-status">
      <ng-container *ngIf="currentUser$ | async as user; else notLoggedIn">
        <span class="user-info">{{ user.username }}</span>
        <button class="logout-btn" (click)="logout()">Déconnexion</button>
      </ng-container>
      <ng-template #notLoggedIn>
        <button class="login-btn" (click)="login()">Connexion CAS</button>
      </ng-template>
    </div>
  `,
  styles: [`
    .auth-status {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-info {
      color: #fff;
      font-size: 0.9rem;
    }
    .login-btn, .logout-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }
    .login-btn {
      background-color: #28a745;
      color: white;
    }
    .login-btn:hover {
      background-color: #218838;
    }
    .logout-btn {
      background-color: #dc3545;
      color: white;
    }
    .logout-btn:hover {
      background-color: #c82333;
    }
  `]
})
export class AuthStatusComponent implements OnInit {
  currentUser$;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
} 