import { Component, OnInit, HostListener } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Required for mat-table
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-affiche-etudiants',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './affiche-etudiants.component.html',
  styleUrls: ['./affiche-etudiants.component.css'],
})
export class AfficheEtudiantsComponent implements OnInit {
  tauxAffectation: number=80 ;
  tauxAffectationInput: number = this.tauxAffectation;

  students: any[] = [];
  columns: any[] = [];
  showEdit = true;
  showDelete = true;

  // Pagination
  page = 1;
  limit = 20;
  total = 0;
  pageCount = 1;
  loading = false;
  maxVisiblePages = 5;

  showFloatingHeader = false;

  constructor(private etudiantService: EtudiantService, private router: Router, private http: HttpClient) {}

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
        console.log('Students:', this.students);
        this.total = response.total;
        this.page = response.page;
        this.pageCount = response.pageCount;
        if (this.students.length > 0) {
          this.columns = Object.keys(this.students[0])
            .filter((key) => key !== 'logs'  && key !== 'createdAt' && key !== 'updatedAt')
            .concat('actions');
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

  viewResults() {
    // Action de visualisation des résultats (à implémenter)
    }

  updateTauxAffectation() {
    if (this.tauxAffectationInput >= 0 && this.tauxAffectationInput <= 100) {
      this.tauxAffectation = this.tauxAffectationInput;
      // console.log(`Taux d'affectation updated to ${this.tauxAffectation}%`);
    } else {
      alert('Please enter a valid percentage between 0 and 100.');
    }
    }

  onDeleteEtudiant(etudiantId:number): void {
      if (etudiantId !== null && confirm("Confirmez-vous la suppression de cet étudiant ?")) {
        this.http.delete(`${environment.apiUrl}/etudiant/${etudiantId}`)
          .subscribe({
            next: () => {
              alert("Étudiant supprimé avec succès.");
              this.loadStudents()
            },
            error: err => {
              console.error("Erreur lors de la suppression de l'étudiant", err);
              alert("Une erreur s'est produite lors de la suppression.");
            }
          });
      }
    }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const table = document.querySelector('table.mat-elevation-z8');
    if (!table) return;
    const rect = table.getBoundingClientRect();
    this.showFloatingHeader = rect.top < 60 && rect.bottom > 60;
  }

}
