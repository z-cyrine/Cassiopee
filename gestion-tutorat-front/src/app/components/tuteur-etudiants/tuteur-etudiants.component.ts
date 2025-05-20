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
  tuteurNom: string = '';
  tuteurPrenom: string = '';
  loading = false;
  errorMessage: string = '';
  currentUserRole: string = '';
  currentUserId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tuteurService: TuteurService
  ) {
    // Get current user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserRole = user.role;
      this.currentUserId = user.id;
      this.tuteurNom = user.name;
      this.tuteurPrenom = user.prenom;
    }
  }

  ngOnInit(): void {
    this.tuteurId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Check if user has permission to view these students
    if (this.currentUserRole === 'prof' && this.currentUserId !== this.tuteurId) {
      this.errorMessage = 'Vous ne pouvez consulter que vos propres étudiants.';
      return;
    }

    this.loading = true;

    // Si c'est un prof, utiliser son nom et prénom
    if (this.currentUserRole === 'prof') {
      this.tuteurService.getTuteurEtudiantsByNomPrenom(this.tuteurNom, this.tuteurPrenom).subscribe({
        next: (etudiants) => {
          this.etudiants = etudiants;
          this.loading = false;
          this.errorMessage = '';
        },
        error: (err) => {
          this.etudiants = [];
          this.loading = false;
          if (err.status === 403) {
            this.errorMessage = 'Vous ne pouvez consulter que vos propres étudiants.';
          } else {
            this.errorMessage = 'Erreur lors du chargement des étudiants.';
          }
        }
      });
    } else {
      // Pour les admins/consultation, utiliser l'ID
      this.tuteurService.getTuteurEtudiants(this.tuteurId).subscribe({
        next: (etudiants) => {
          this.etudiants = etudiants;
          this.loading = false;
          this.errorMessage = '';
        },
        error: (err) => {
          this.etudiants = [];
          this.loading = false;
          this.errorMessage = 'Erreur lors du chargement des étudiants.';
        }
      });
    }
  }

  goBack(): void {
    if (this.currentUserRole === 'prof') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/tuteurs/all']);
    }
  }
} 