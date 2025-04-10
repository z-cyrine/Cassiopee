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

@Component({
  selector: 'app-affectation-manuelle',
  imports: [MatTableModule, CommonModule, MatCardModule, FormsModule, MatExpansionModule, MatButtonToggleModule, FiltreEtudiantsComponent],
  templateUrl: './affectation-manuelle.component.html',
  styleUrl: './affectation-manuelle.component.css'
})
export class AffectationManuelleComponent {

  tutorFilterStatus: any;
  tutorFilterLangue: any;

  students: any[] = [];
  tuteurs: any[] = [];

  showEdit = true;
  showDelete = true;

  columnsStudents: any[] = [];
  columnsTuteurs: string[] = ['id', 'nom', 'prenom', 'email', 'departement', 'langueTutorat', 'profil', 'statut', 'actions'];
  
  studentFilterLangue: any;
  studentFilterStatus: any;

  constructor(private etudiantService: EtudiantService, private tuteurService: TuteurService) {}

  ngOnInit() {
    this.etudiantService.getStudents().subscribe({
      next: (response) => {
        this.students = response;
        if (response.length > 0) {
          this.columnsStudents = Object.keys(response[0])
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
  filterVisible=false;
  readonly panelOpenState = signal(false);

  filters = {  // Initialisation de la propriété filters
    students: 'tous', // Choix par défaut pour les étudiants
    teachers: '' // Choix vide par défaut pour les enseignants
  };

  toggleFilter() {
      this.filterVisible = !this.filterVisible;
      console.log('Filter visible:', this.filterVisible);
    }

  applyFilter() {
      throw new Error('Method not implemented.');
      }
  
  applyFilters() {
      throw new Error('Method not implemented.');
      }
}
