import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<div>Authentification en cours...</div>'
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const ticket = params['ticket'];
      const error = params['error'];

      if (error) {
        console.error('Authentication error:', error);
        this.router.navigate(['/login']);
        return;
      }

      if (ticket) {
        const serviceUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
        this.authService.validateTicket(ticket, serviceUrl).subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          error: (error) => {
            console.error('Ticket validation error:', error);
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
} 