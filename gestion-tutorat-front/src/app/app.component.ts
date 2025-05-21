import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './services/error.interceptor';
import { ImportComponent } from './components/import/import.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { AuthService } from './services/gestion-acces/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LanguageSelectorComponent, TranslateModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
}) 

export class AppComponent {
  title = 'gestion-tutorat-front';

  role: string | null = null;
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.authStatus$.subscribe(() => {
      this.role = this.authService.getUserRole();
      this.isAuthenticated = this.authService.isAuthenticated();
    });

    // Appel initial
    this.authService.updateAuthStatus();
  }
  
  casLoginUrl = `${environment.apiUrl}/cas/login`;
  casLogoutUrl = `${environment.CAS_BASE_URL}/logout?service=${encodeURIComponent(environment.FRONTEND_URL)}`;

  onLogout() {
    this.authService.logout();
    localStorage.clear();
    window.location.href = this.casLogoutUrl;
  }
  
  getDashboard(){
    if (this.isAuthenticated) {
      const userStr = localStorage.getItem('user');
      if (userStr){
      const user = JSON.parse(userStr);
      this.router.navigate(['/tuteur-dashboard', user.id, 'etudiants']);
      }
    }

  }
}
