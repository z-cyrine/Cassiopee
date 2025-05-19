import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>{{ 'AUTH.LOGIN_TITLE' | translate }}</h1>
        <button (click)="login()" class="login-button">
          {{ 'AUTH.LOGIN' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .login-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
    }
    .login-button:hover {
      background-color: #0056b3;
    }
  `]
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login();
  }
} 