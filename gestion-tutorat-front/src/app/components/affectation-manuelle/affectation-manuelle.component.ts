import { Component } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TuteurService } from '../../services/tuteur/tuteur.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ChangeDetectionStrategy,signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FiltreEtudiantsComponent } from "../filtre-etudiants/filtre-etudiants.component";
import { AffecterComponent } from "./affecter/affecter.component";
import { Tuteur } from '../../services/tuteur/tuteur.service';

@Component({
  selector: 'app-affectation-manuelle',
  imports: [MatTableModule, CommonModule, MatCardModule, FormsModule, MatExpansionModule, MatButtonToggleModule, FiltreEtudiantsComponent, AffecterComponent],
  templateUrl: './affectation-manuelle.component.html',
  styleUrls: ['./affectation-manuelle.component.css']
})
export class AffectationManuelleComponent {

  students: any[] = [];
  tuteurs: any[] = [];
  filteredStudents = [...this.students];

  showEdit = true;
  showDelete = true;

  columnsStudents: any[] = [];
  columnsTuteurs: string[] = ['id', 'nom', 'prenom', 'email', 'departement', 'langueTutorat', 'profil', 'statut', 'actions'];

  constructor(private etudiantService: EtudiantService, private tuteurService: TuteurService) {}

  ngOnInit() {
    this.etudiantService.getStudents().subscribe({
      next: (response) => {
        this.students = response.data;
        this.filteredStudents = response.data;
        if (response.data.length > 0) {
          this.columnsStudents = Object.keys(response.data[0])
          .filter((key) => key !== 'logs')
          .concat('actions');
        }

        console.log('Students:', this.columnsStudents);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });

    this.tuteurService.getTuteurs().subscribe({
      next: (response) => {
        this.tuteurs = response;
        if (response.length > 0) {
          this.columnsTuteurs = Object.keys(response[0])
          .concat('actions');
        }
        console.log('Tuteurs:', this.tuteurs);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });
  }

  delete(_t27: any) {
    throw new Error('Method not implemented.');
    }

  edit(_t27: any) {
    throw new Error('Method not implemented.');
    }
  
  /// FILTRES
  readonly panelOpenState = signal(false);
      
  // onFiltersApplied(filters: any) {
  //   console.log(filters)
  //   //     this.filteredStudents = this.students.filter(student => {
  //   //       const matchNom = filters.showNom ? student.nom.toLowerCase().includes(filters.name.toLowerCase()) : true;
  //   //       const matchAffectation = filters.showAffectation ? student.affecte === (filters.affectation === 'Affecté') : true;
  //   //       const matchDep = filters.showdep ? student.codeClasse === filters.dep : true;
  //   //       return matchNom && matchAffectation && matchDep;
  //   //     });
  //   //     console.log(this.filteredStudents);
  //     }


  // Résultat affectation
  onEtudiantAffecte(event: { etudiantId: number; tuteur: Tuteur }) {
    const { etudiantId, tuteur } = event;
  
    // 1. Met à jour l'étudiant concerné
    const etuIndex = this.students.findIndex(e => e.id === etudiantId);
    if (etuIndex !== -1) {
      this.students[etuIndex].affecte = true;
      this.students[etuIndex].tuteur = `${tuteur.prenom} ${tuteur.nom}`;
    }
  
    // 2. Met à jour le solde du tuteur concerné
    const tutIndex = this.tuteurs.findIndex(t => t.id === tuteur.id);
    if (tutIndex !== -1) {
      this.tuteurs[tutIndex] = tuteur; // ou juste tuteurs[tutIndex].soldeTutoratRestant = tuteur.soldeTutoratRestant;
    }
  
    // 3. Optionnel : Met à jour les étudiants filtrés
    this.filteredStudents = [...this.students];
  }
  
      
}
