import { Component, OnInit, HostListener } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { FormatNamePipe } from '../../pipes/format-name/format-name.pipe';

@Component({
  selector: 'app-affiche-etudiants',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatTableModule, 
    MatIconModule, 
    RouterLink, 
    TranslateModule,
    FormatNamePipe
  ],
  templateUrl: './affiche-etudiants.component.html',
  styleUrls: ['./affiche-etudiants.component.css'],
})
export class AfficheEtudiantsComponent implements OnInit {
  tauxAffectation: number = 80;
  tauxAffectationInput: number = this.tauxAffectation;

  students: any[] = [];
  columns: any[] = [];
  showEdit = true;
  showDelete = true;

  page = 1;
  limit = 20;
  total = 0;
  pageCount = 1;
  loading = false;
  maxVisiblePages = 5;
  showFloatingHeader = false;
  loadingFrozen: { [id: number]: boolean } = {};
  displayedColumns: string[] = [];

  // 🔍 Search inputs
  searchNom: string = '';
  searchPrenom: string = '';

  constructor(
    private etudiantService: EtudiantService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const halfVisible = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(1, this.page - halfVisible);
    let end = Math.min(this.pageCount, start + this.maxVisiblePages - 1);

    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.pageCount && pageNumber !== this.page) {
      this.page = pageNumber;
      this.loadStudents();
    }
  }

  loadStudents() {
    this.loading = true;
    this.etudiantService.getStudents(this.page, this.limit).subscribe({
      next: (response) => {
        this.students = response.data;
        this.total = response.total;
        this.page = response.page;
        this.pageCount = response.pageCount;
        if (this.students.length > 0) {
          this.columns = Object.keys(this.students[0])
            .filter((key) => key !== 'logs' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'frozen' && key !== 'majeure')
            .concat('actions');
          this.displayedColumns = ['figer', 'id', ...this.columns.filter(c => c !== 'id' && c !== 'figer')];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.loading = false;
      },
    });
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
      this.loadStudents();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadStudents();
    }
  }

  updateTauxAffectation() {
    if (this.tauxAffectationInput >= 0 && this.tauxAffectationInput <= 100) {
      this.tauxAffectation = this.tauxAffectationInput;
    } else {
      alert('Veuillez entrer un pourcentage entre 0 et 100.');
    }
  }

  onDeleteEtudiant(etudiantId: number): void {
    if (etudiantId !== null && confirm("Confirmez-vous la suppression de cet étudiant ?")) {
      this.http.delete(`${environment.apiUrl}/etudiant/${etudiantId}`).subscribe({
        next: () => {
          alert("Étudiant supprimé avec succès.");
          this.loadStudents();
        },
        error: err => {
          console.error("Erreur lors de la suppression de l'étudiant", err);
          alert("Une erreur s'est produite lors de la suppression.");
        }
      });
    }
  }

  toggleFrozenEtudiant(etudiant: any): void {
    const action = etudiant.frozen ? 'unfreeze' : 'freeze';
    this.loadingFrozen[etudiant.id] = true;
    this.etudiantService.toggleFrozen(etudiant.id, action).subscribe({
      next: () => {
        this.loadStudents();
        this.loadingFrozen[etudiant.id] = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du changement de statut figé:', err);
        this.loadingFrozen[etudiant.id] = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const table = document.querySelector('table.mat-elevation-z8');
    if (!table) return;
    const rect = table.getBoundingClientRect();
    this.showFloatingHeader = rect.top < 60 && rect.bottom > 60;
  }

  searchResults: any[] = [];
searchMode: boolean = false;

onSearch(): void {
  if (!this.searchNom.trim() && !this.searchPrenom.trim()) {
    alert('Veuillez saisir un nom ou un prénom.');
    return;
  }

  this.loading = true;
  this.etudiantService.searchStudents(this.searchNom, this.searchPrenom).subscribe({
    next: (results: any[]) => {
      this.searchResults = results;
      this.searchMode = true;
      this.loading = false;
    },
    error: (err: any) => {
      console.error('Erreur lors de la recherche :', err);
      this.searchResults = [];
      this.searchMode = true;
      this.loading = false;
    }
  });
}

onClearSearch(): void {
  this.searchNom = '';
  this.searchPrenom = '';
  this.searchMode = false;
  this.searchResults = [];
  this.loadStudents();
}

}
