import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuteurService } from '../../services/tuteur/tuteur.service';
import { Etudiant } from '../../services/etudiant/etudiant.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tuteur-etudiants',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule],
  templateUrl: './tuteur-etudiants.component.html',
  styleUrls: ['./tuteur-etudiants.component.css']
})
export class TuteurEtudiantsComponent implements OnInit {
  etudiants: Etudiant[] = [];
  displayedColumns: string[] = [
    'id', 'nom', 'prenom', 'emailEcole', 'origine', 'ecole', 'codeClasse', 'nomGroupe', 'langueMajeure', 'iniAlt', 'entreprise', 'fonctionApprenti'
  ];
  tuteurId: number = 0;
  loading = false;

  constructor(private route: ActivatedRoute, private tuteurService: TuteurService) {}

  ngOnInit(): void {
    this.tuteurId = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.tuteurService.getTuteurEtudiants(this.tuteurId).subscribe({
      next: (etudiants) => {
        this.etudiants = etudiants;
        this.loading = false;
      },
      error: () => {
        this.etudiants = [];
        this.loading = false;
      }
    });
  }
} 