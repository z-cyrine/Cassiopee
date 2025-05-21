import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuteurService } from '../../services/tuteur/tuteur.service';
import { Etudiant } from '../../services/etudiant/etudiant.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tuteur-etudiants',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './tuteur-etudiants.component.html',
  styleUrls: ['./tuteur-etudiants.component.css']
})
export class TuteurEtudiantsComponent implements OnInit {
  etudiants: Etudiant[] = [];
  displayedColumns: string[] = [
    'id', 'nom', 'prenom', 'emailEcole', 'origine', 'ecole', 'codeClasse',
    'nomGroupe', 'langueMajeure', 'iniAlt', 'entreprise', 'fonctionApprenti'
  ];
  tuteurId: number = 0;
  loading = false;
  errorMessage: string = '';
  currentUserRole: string = '';
  currentUserEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tuteurService: TuteurService
  ) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserRole = user.role;
      this.currentUserEmail = user.email;
    }
  }

  ngOnInit(): void {
    this.tuteurId = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    if (this.currentUserRole === 'prof') {
      this.tuteurService.getTuteurByUserEmail(this.currentUserEmail).subscribe({
        next: (tuteur) => {
          if (tuteur.id !== this.tuteurId) {
            this.errorMessage = 'Vous ne pouvez consulter que vos propres étudiants.';
            this.loading = false;
            return;
          }
          this.loadEtudiants(tuteur.id);
        },
        error: () => {
          this.errorMessage = 'Impossible de récupérer le tuteur connecté.';
          this.loading = false;
        }
      });
    } else {
      this.loadEtudiants(this.tuteurId);
    }
  }

  loadEtudiants(id: number): void {
    this.tuteurService.getTuteurEtudiants(id).subscribe({
      next: (etds) => {
        this.etudiants = etds;
        this.loading = false;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des étudiants.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.currentUserRole === 'prof') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/tuteurs/all']);
    }
  }
}
