import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TuteurService, Tuteur } from '../../services/tuteur/tuteur.service';
import { Etudiant } from '../../services/etudiant/etudiant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    
    const tuteurId = 45; // ⚠️ À remplacer plus tard par l'ID du tuteur connecté

    this.tuteurService.findOne(tuteurId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Tuteur) => {
          this.tuteur = data;
          this.loadEtudiantsAffectes(tuteurId);
        },
        error: (err) => {
          console.error('Erreur lors du chargement du tuteur', err);
          this.errorMessage = 'Erreur lors du chargement des informations du tuteur.';
          this.loading = false;
        },
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
}
