import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TuteurService, Tuteur } from '../../services/tuteur/tuteur.service';
import { Etudiant } from '../../services/etudiant/etudiant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/gestion-acces/auth-service.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  standalone: true,
  selector: 'app-tuteur-dashboard',
  templateUrl: './tuteur-dashboard.component.html',
  styleUrls: ['./tuteur-dashboard.component.css'],
  imports: [CommonModule, RouterModule , TranslateModule],
})
export class TuteurDashboardComponent implements OnInit, OnDestroy {
  tuteur!: Tuteur;
  etudiants: Etudiant[] = [];
  loading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private tuteurService: TuteurService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getDecodedToken();

    if (!user || user.role !== 'prof') {
      this.router.navigate(['/']);
      return;
    }

    const email = user.email;

    this.tuteurService.getTuteurByUserEmail(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tuteur: Tuteur) => {
          this.tuteur = tuteur;
          if (tuteur.id) {
            this.loadEtudiantsAffectes(tuteur.id);
          }
        },
        error: (err) => {
          console.error('Erreur de récupération du tuteur', err);
          this.errorMessage = "Impossible de récupérer les informations du tuteur.";
          this.loading = false;
        }
      });
  }

  loadEtudiantsAffectes(tuteurId: number): void {
    this.tuteurService.getTuteurEtudiants(tuteurId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (etds: Etudiant[]) => {
          this.etudiants = etds;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des étudiants', err);
          this.errorMessage = "Erreur lors du chargement des étudiants affectés.";
          this.loading = false;
        },
      });
  }

  voirDetailsEtudiant(id: number): void {
    this.router.navigate(['/etudiants', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

voirMonProfil(): void {
  if (this.tuteur && this.tuteur.id) {
    this.router.navigate(['/tuteurs', this.tuteur.id]);
  } else {
    this.errorMessage = 'Impossible de naviguer vers le profil — Tuteur non chargé.';
  }
}

voirMonProfilUtilisateur(): void {
  this.router.navigate(['/profil']);
}

}

