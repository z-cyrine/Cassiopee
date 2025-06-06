import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, User } from '../../services/user/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { TuteurService } from '../../services/tuteur/tuteur.service';
import { Etudiant } from '../../services/etudiant/etudiant.service';
import { AuthService } from '../../services/gestion-acces/auth-service.service';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  etudiants: Etudiant[] = [];
  private destroy$ = new Subject<void>();

  casLogoutUrl = `${environment.CAS_BASE_URL}/logout`;

  constructor(private userService: UserService, private tuteurService: TuteurService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur authentifié depuis le localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      // Si c'est un prof, charger ses étudiants
      if (this.user && this.user.role === 'prof') {
        this.tuteurService.getTuteurEtudiants(this.user.id).subscribe({
          next: (etudiants) => this.etudiants = etudiants,
          error: (err) => this.etudiants = []
        });
      }
    } else {
      this.user = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editProfile(): void {
    if (this.user) {
      this.router.navigate(['/utilisateurs/edit', this.user.id]);
    }
  }

  goToTutees(): void {
  if (!this.user?.email) return;

  this.tuteurService.getTuteurByUserEmail(this.user.email).subscribe({
    next: (tuteur) => {
      if (tuteur?.id) {
        this.router.navigate(['/tuteur', tuteur.id, 'etudiants']);
      } else {
        console.error('Tuteur introuvable pour cet utilisateur.');
      }
    },
    error: (err) => {
      console.error('Erreur lors de la récupération du tuteur', err);
    }
  });
}


  logout() {
  console.log('Logging out...');
  this.authService.logout();
  console.log('logged out');
  console.log("token:", this.authService.getToken());
  window.location.href = this.casLogoutUrl;
}

}
