import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.casLoginUrl = `https://cas7d.imtbs-tsp.eu/cas/login?service=${encodeURIComponent(environment.apiUrl)}`;
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.accessToken);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Identifiants incorrects';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
