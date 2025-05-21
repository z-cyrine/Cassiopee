import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/gestion-acces/auth-service.service';

@Component({
  standalone: true,
  selector: 'app-redirector',
  template: '', // rien à afficher
})
export class RedirectorComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getDecodedToken();
    if (user?.role === 'prof') {
      this.router.navigate(['/tuteur-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
