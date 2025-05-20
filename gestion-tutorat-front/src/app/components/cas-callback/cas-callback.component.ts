import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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
    private router: Router
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
              this.router.navigate(['/home']);
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
