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
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { ReportingService } from '../../services/reporting/reporting.service';
import { FiltreTuteurComponent } from '../../filtre-tuteur/filtre-tuteur.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-affectation-manuelle',
  imports: [MatIconModule, MatTableModule, CommonModule, MatCardModule, FormsModule, MatExpansionModule, MatButtonToggleModule, FiltreEtudiantsComponent, AffecterComponent, RouterModule, FiltreTuteurComponent, TranslateModule
  ],
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

  departments: string[] = [];

  //PAGINATION
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private etudiantService: EtudiantService, private tuteurService: TuteurService, private router: Router, private http: HttpClient, private reportingService: ReportingService) {}

  // INITIALISATION
  ngOnInit() {
    this.loadAllStudents();
    this.loadTuteurs();
    this.loadDepartments();
  }

    loadTuteurs() {
    this.tuteurService.getTuteurs().subscribe({
      next: (response) => {
        this.tuteurs = response;
        this.filteredTuteurs = [...this.tuteurs];
        this.totalItemsTuteur = this.filteredTuteurs.length;
        this.totalPagesTuteur = Math.ceil(this.totalItemsTuteur / this.itemsPerPageTuteur);
        this.currentPageTuteur = 1;
        this.updatePagedTuteurs();
      },
      error: (err) => console.error('Erreur chargement tuteurs', err)
    });
  }
  
  loadAllStudents() {
    this.etudiantService.getAllStudents().subscribe({
      next: (response) => {
        this.students = response;
        this.filteredStudents = [...this.students];
        this.totalItems = this.filteredStudents.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePagedStudents();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des étudiants:', err);
      }
    });
  }

  loadDepartments() {
    this.reportingService.getDistinctDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  //BOUTONS
  onDeleteEtudiant(etudiantId:number): void {
      if (etudiantId !== null && confirm("Confirmez-vous la suppression de cet étudiant ?")) {
        this.http.delete(`${environment.apiUrl}/etudiant/${etudiantId}`)
          .subscribe({
            next: () => {
              alert("Étudiant supprimé avec succès.");
              this.loadAllStudents();
            },
            error: err => {
              console.error("Erreur lors de la suppression de l'étudiant", err);
              alert("Une erreur s'est produite lors de la suppression.");
            }
          });
      }
    }

    onDeleteTuteur(tuteurId?:number) {
      if (tuteurId !== null && confirm("Confirmez-vous la suppression de ce tuteur ?")) {
        this.http.delete(`${environment.apiUrl}/tuteur/${tuteurId}`)
          .subscribe({
            next: () => {
              alert("Tuteur supprimé avec succès.");
              this.loadTuteurs()
            },
            error: err => {
              console.error("Erreur lors de la suppression du tuteur", err);
              alert("Une erreur est survenue lors de la suppression.");
            }
          });
      }
      }

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
    this.filteredTuteurs = [...this.tuteurs]; // <-- AJOUTE CECI si absent
    this.updatePagedStudents();
    this.updatePagedTuteurs();
  }
  
  //PAGINATION
  paginate<T>(list: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return list.slice(startIndex, endIndex);
  }

  //PAGINATION ETUDIANTS 
  getVisiblePages(): number[] {
  const pages: number[] = [];
  const maxVisible = 3;
  let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > this.totalPages) {
    endPage = this.totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedStudents();
    }
  }

  goToPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagedStudents();
  }
}

  goToNextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagedStudents();
  }
}


  pagedStudents: any[] = [];

  updatePagedStudents() {
    this.pagedStudents = this.paginate(this.filteredStudents, this.currentPage, this.itemsPerPage);
  }



  //PAGINATION TUTEURS
  currentPageTuteur = 1;
  totalPagesTuteur = 1;
  itemsPerPageTuteur = 5;
  totalItemsTuteur = 0;
  pagedTuteurs: Tuteur[] = [];

  updatePagedTuteurs() {
    this.pagedTuteurs = this.paginate(this.filteredTuteurs, this.currentPageTuteur, this.itemsPerPageTuteur);
  }

  getVisiblePagesTuteur(): number[] {
    const pages: number[] = [];
    const maxVisible = 3;
    let startPage = Math.max(1, this.currentPageTuteur - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > this.totalPagesTuteur) {
      endPage = this.totalPagesTuteur;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
  
  goToPageTuteur(page: number) {
    if (page !== this.currentPageTuteur && page >= 1 && page <= this.totalPagesTuteur) {
      this.currentPageTuteur = page;
      this.updatePagedTuteurs();
    }
  }
  
  goToPreviousPageTuteur() {
    if (this.currentPageTuteur > 1) {
      this.currentPageTuteur--;
      this.updatePagedTuteurs();
    }
  }

  goToNextPageTuteur() {
    if (this.currentPageTuteur < this.totalPagesTuteur) {
      this.currentPageTuteur++;
      this.updatePagedTuteurs();
    }
  }

  filteredTuteurs: Tuteur[] = [];

  
  //FILTRE ETUDIANT

  applyFilters(filters: any) {
  this.filteredStudents = this.students.filter(student => {
    const matchAffectation = !filters.showAffectation || 
      (filters.affectation === 'Tous') ||
      (filters.affectation === 'Affecté' && student.affecte) ||
      (filters.affectation === 'Non affecté' && !student.affecte);

    const fullName = (student.nom + ' ' + student.prenom).toLowerCase();
    const matchLastName = !filters.showNom || filters.lastName.trim() === '' || student.nom.toLowerCase().includes(filters.lastName.toLowerCase());
    const matchFirstName = !filters.showNom || filters.firstName.trim() === '' || student.prenom.toLowerCase().includes(filters.firstName.toLowerCase());


    const matchDep = !filters.showdep || 
      (filters.dep === 'Tous') ||
      (student.codeClasse && student.codeClasse === filters.dep);

      const matchDept = !filters.showDepartement ||
      (filters.departement === 'Tous') ||
      (student.departementRattachement && student.departementRattachement === filters.departement);

    return matchAffectation && matchLastName && matchFirstName && matchDep && matchDept;
  });

  this.totalItems = this.filteredStudents.length;
  this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  this.currentPage = 1;
  this.updatePagedStudents();
}

//FILTRE TUTEUR
  applyTutorFilters(filters: any) {
    this.filteredTuteurs = this.tuteurs.filter(tuteur => {
      const matchNom = !filters.showNom || !filters.nom || tuteur.nom?.toLowerCase().includes(filters.nom.toLowerCase());
      const matchPrenom = !filters.showNom || !filters.prenom || tuteur.prenom?.toLowerCase().includes(filters.prenom.toLowerCase());

      const matchProfil = !filters.showProfil ||
        filters.profil === 'Tous' ||
        (filters.profil === 'Non spécifié' && (tuteur.profil === '' || tuteur.profil == null)) ||
        tuteur.profil === filters.profil;

      const matchDept = !filters.showDepartement ||
        filters.departement === 'Tous' ||
        tuteur.departement === filters.departement;

      const matchSolde = !filters.showSoldeRestant || tuteur.soldeTutoratRestant >= filters.soldeRestant;

      const matchNbTut = !filters.showNbAffectes || tuteur.nbTutoratAffecte >= filters.nbAffectes;

      return matchNom && matchPrenom && matchProfil && matchDept && matchSolde && matchNbTut;
    });

    this.totalItemsTuteur = this.filteredTuteurs.length;
    this.totalPagesTuteur = Math.ceil(this.totalItemsTuteur / this.itemsPerPageTuteur);
    this.currentPageTuteur = 1;
    this.updatePagedTuteurs();
  }

  
}
