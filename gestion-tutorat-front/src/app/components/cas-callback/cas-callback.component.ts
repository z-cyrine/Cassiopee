import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/gestion-acces/auth-service.service';

@Component({
  selector: 'app-cas-callback',
  imports: [],
  templateUrl: './cas-callback.component.html',
  styleUrl: './cas-callback.component.css'
})
export class CasCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const ticket = params['ticket'];
      if (ticket) {
        this.http.get(`${environment.apiUrl}/cas/validate?ticket=${ticket}`)
          .subscribe({
            next: (res: any) => {
              console.log('✔️ Utilisateur connecté :', res);
              localStorage.setItem('token', res.token);
              localStorage.setItem('user', JSON.stringify(res.user));
              localStorage.setItem('token', res.token);
              this.authService.updateAuthStatus();
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('❌ Erreur validation CAS', err);
              this.router.navigate(['/home'], { queryParams: { error: 'unauthorized' } });
            }
          });
      }
    });
  }
}
