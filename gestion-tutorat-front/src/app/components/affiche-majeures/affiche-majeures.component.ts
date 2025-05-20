import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MajorsService } from '../../services/majors/majors.service';
import { FormsModule } from '@angular/forms';               
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-affiche-majeures',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, TranslateModule], 
  templateUrl: './affiche-majeures.component.html',
  styleUrls: ['./affiche-majeures.component.css'],
})
export class AfficheMajeuresComponent implements OnInit {
  majeures: any[] = [];
  pagedMajeures: any[] = [];
  columns: string[] = [
    'id', 'code', 'groupe', 'dept', 'responsible', 'langue', 'iniAlt', 'programme', 'actions'
  ];
  showEdit = true;
  showDelete = true;

  // Pagination
  page = 1;
  limit = 9;
  total = 0;
  pageCount = 1;
  loading = false;
  maxVisiblePages = 5;

  searchCode: string = '';
searchGroupe: string = '';
searchMode: boolean = false;
searchResults: any[] = [];


  propertyLabels = [
    { key: 'groupe', label: 'MAJORS.MAJOR_GROUP' },
    { key: 'dept', label: 'MAJORS.DEPARTMENT' },
    { key: 'responsible', label: 'MAJORS.RESPONSIBLE' },
    { key: 'langue', label: 'MAJORS.LANGUAGE_TAUGHT' },
    { key: 'iniAlt', label: 'MAJORS.INI_ALT' },
    { key: 'programme', label: 'MAJORS.PROGRAM' },
    { key: 'code', label: 'MAJORS.CODE_CLASS' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private majorsService: MajorsService

  ) {}

  ngOnInit(): void {
    this.loadMajeures();
  }

  loadMajeures() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/majeures`).subscribe({
      next: (response) => {
        this.majeures = response;
        this.total = this.majeures.length;
        this.pageCount = Math.ceil(this.total / this.limit);
        this.updatePagedMajeures();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des majeures:', err);
        this.loading = false;
      },
    });
  }

  updatePagedMajeures() {
    const start = (this.page - 1) * this.limit;
    const end = this.page * this.limit;
    this.pagedMajeures = this.majeures.slice(start, end);
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
    this.updatePagedMajeures();
  }
}

nextPage(): void {
  if (this.page < this.pageCount) {
    this.page++;
    this.updatePagedMajeures();
  }
}

prevPage(): void {
  if (this.page > 1) {
    this.page--;
    this.updatePagedMajeures();
  }
}


  onDeleteMajeure(majeureId: number): void {
    if (majeureId !== null && confirm("Confirmez-vous la suppression de cette majeure ?")) {
      this.http.delete(`${environment.apiUrl}/majeures/${majeureId}`)
        .subscribe({
          next: () => {
            alert("Majeure supprimée avec succès.");
            this.loadMajeures();
          },
          error: err => {
            console.error("Erreur lors de la suppression de la majeure", err);
            alert("Une erreur s'est produite lors de la suppression.");
          }
        });
    }
  }

  onEditMajeure(majeureKey: string): void {
    this.router.navigate(['/majeures/edit', majeureKey]);
  }

  onSearch(): void {
  if (!this.searchCode && !this.searchGroupe) {
    alert('Veuillez entrer un code ou un groupe pour la recherche.');
    return;
  }

  this.loading = true;
  this.searchMode = true;

  this.majorsService.searchMajors(this.searchCode, this.searchGroupe).subscribe({
    next: (results) => {
      this.searchResults = results;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur lors de la recherche:', err);
      this.loading = false;
      this.searchResults = [];
    }
  });
}

onClearSearch(): void {
  this.searchCode = '';
  this.searchGroupe = '';
  this.searchMode = false;
  this.searchResults = [];
  this.loadMajeures();
}


} 