import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-affiche-majeures',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
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
  limit = 20;
  total = 0;
  pageCount = 1;
  loading = false;
  maxVisiblePages = 5;

  propertyLabels = [
    { key: 'groupe', label: 'majeure/groupe' },
    { key: 'dept', label: 'departement' },
    { key: 'responsible', label: 'responsable' },
    { key: 'langue', label: 'langue enseignée' },
    { key: 'iniAlt', label: 'INI/ALT' },
    { key: 'programme', label: 'programme' },
    { key: 'code', label: 'code classe' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
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
    const start = Math.max(1, this.page - Math.floor(this.maxVisiblePages / 2));
    const end = Math.min(this.pageCount, start + this.maxVisiblePages - 1);
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

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
      this.updatePagedMajeures();
    }
  }

  prevPage() {
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
} 