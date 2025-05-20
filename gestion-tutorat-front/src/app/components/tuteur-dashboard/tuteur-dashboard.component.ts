import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TuteurService, Tuteur } from '../../services/tuteur/tuteur.service';
import { Etudiant } from '../../services/etudiant/etudiant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/gestion-acces/auth-service.service';

@Component({
  standalone: true,
  selector: 'app-tuteur-dashboard',
  templateUrl: './tuteur-dashboard.component.html',
  styleUrls: ['./tuteur-dashboard.component.css'],
  imports: [CommonModule, RouterModule],
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
    if (user?.role !== 'prof') {
      this.router.navigate(['/']);
      return;
    }
  }

  loadTuteurByEmail(email: string) {
    this.tuteurService.getTuteurByEmail(email).subscribe({
      next: (res) => {
        this.tuteur = res;
        if (res.id) {
          this.loadEtudiantsAffectes(res.id);
        }
      },
      error: () => {
        this.errorMessage = 'Tuteur non trouvé';
        this.loading = false;
      }
    });
  }

  // loadEtudiants(tuteurId: number) {
  //   this.tuteurService.getEtudiantsParTuteur(tuteurId).subscribe({
  //     next: (data) => {
  //       this.etudiants = data;
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.errorMessage = 'Erreur de chargement des étudiants';
  //       this.loading = false;
  //     }
  //   });
  // }


  //   // const tuteurId = 45; // ⚠️ À remplacer plus tard par l'ID du tuteur connecté

  //   this.tuteurService.findOne(tuteurId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (data: Tuteur) => {
  //         this.tuteur = data;
  //         this.loadEtudiantsAffectes(tuteurId);
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du chargement du tuteur', err);
  //         this.errorMessage = 'Erreur lors du chargement des informations du tuteur.';
  //         this.loading = false;
  //       },
  //     });
  // }

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
}
