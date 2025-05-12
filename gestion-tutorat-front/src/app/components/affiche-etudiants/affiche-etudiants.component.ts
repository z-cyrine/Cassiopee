import { Component, OnInit } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Required for mat-table
@Component({
  selector: 'app-affiche-etudiants',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, CommonModule],
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
  maxVisiblePages = 5; // Nombre maximum de pages visibles dans la pagination

  constructor(private etudiantService: EtudiantService) {}

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
          .filter((key) => key !== 'logs')
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

  private formatHeader(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private extractNestedData(element: any, key: string): any {
    const keys = key.split('.'); 
    return keys.reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : ''), element);
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

    edit(element: any): void {
      console.log('Edit:', element);
    }
  
    delete(element: any): void {
      console.log('Delete:', element);
    }

}
