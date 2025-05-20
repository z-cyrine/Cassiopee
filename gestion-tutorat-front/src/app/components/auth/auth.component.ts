import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink, TranslateModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loading = false;
  errorMessage = '';
  loginForm: any;
  casLoginUrl='';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.casLoginUrl = `${environment.apiUrl}/cas/login`;
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.accessToken);
        // Stocker l'utilisateur authentifié pour le profil
        const user = {
          id: res.userId,
          name: res.username,
          email: res.email,
          role: res.role,
          createdAt: res.createdAt,
        };
        localStorage.setItem('user', JSON.stringify(user));
        console.log("login successful");
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.translate.instant('AUTH.LOGIN_ERROR');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
