import { Component, OnInit } from '@angular/core';
import { TuteurService } from '../../services/tuteur/tuteur.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-affiche-tuteurs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, RouterLink, TranslateModule],
  templateUrl: './affiche-tuteurs.component.html',
  styleUrls: ['./affiche-tuteurs.component.css'],
})
export class AfficheTuteursComponent implements OnInit {
  tuteurs: any[] = [];
  pagedTuteurs: any[] = [];
  columns: string[] = [
    'id', 'nom', 'prenom', 'email', 'departement', 'estEligiblePourTutorat', 'statut', 'colonne2', 'infoStatut',
    'langueTutorat', 'profil', 'parTutoratAlt', 'tutoratAltAff', 'soldeAlt', 'parTutoratIni', 'tutoratIniAff', 'soldeIni',
    'totalEtudiantsPar', 'nbTutoratAffecte', 'soldeTutoratRestant', 'matieres', 'domainesExpertise', 'actions'
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

  constructor(
    private tuteurService: TuteurService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTuteurs();
  }

  loadTuteurs() {
    this.loading = true;
    this.tuteurService.getTuteurs().subscribe({
      next: (response) => {
        this.tuteurs = response.map((tuteur: any) => ({
          ...tuteur,
          langueTutorat: Array.isArray(tuteur.langueTutorat)
            ? tuteur.langueTutorat
            : (typeof tuteur.langueTutorat === 'string' && tuteur.langueTutorat.trim() !== ''
                ? (tuteur.langueTutorat as string).split(',').map((s: string) => s.trim())
                : []),
          matieres: Array.isArray(tuteur.matieres)
            ? tuteur.matieres
            : (typeof tuteur.matieres === 'string' && tuteur.matieres.trim() !== ''
                ? (tuteur.matieres as string).split(',').map((s: string) => s.trim())
                : []),
          domainesExpertise: Array.isArray(tuteur.domainesExpertise)
            ? tuteur.domainesExpertise
            : (typeof tuteur.domainesExpertise === 'string' && tuteur.domainesExpertise.trim() !== ''
                ? (tuteur.domainesExpertise as string).split(',').map((s: string) => s.trim())
                : []),
          infoStatut: tuteur.infoStatut || tuteur.info_statut || tuteur.infostatut || '',
        }));
        console.log('Premier tuteur reçu:', this.tuteurs[25]);
        this.total = this.tuteurs.length;
        this.pageCount = Math.ceil(this.total / this.limit);
        this.updatePagedTuteurs();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tuteurs:', err);
        this.loading = false;
      },
    });
  }

  updatePagedTuteurs() {
    const start = (this.page - 1) * this.limit;
    const end = this.page * this.limit;
    this.pagedTuteurs = this.tuteurs.slice(start, end);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const max = this.pageCount;
    const current = this.page;
    const maxVisible = this.maxVisiblePages;
  
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(max, start + maxVisible - 1);
  
    // Ajuste start si on est en fin de pagination
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.pageCount && pageNumber !== this.page) {
      this.page = pageNumber;
      this.updatePagedTuteurs();
    }
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
      this.updatePagedTuteurs();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagedTuteurs();
    }
  }

  onDeleteTuteur(tuteurId: number): void {
    if (tuteurId !== null && confirm("Confirmez-vous la suppression de ce tuteur ?")) {
      this.http.delete(`${environment.apiUrl}/tuteur/${tuteurId}`)
        .subscribe({
          next: () => {
            alert("Tuteur supprimé avec succès.");
            this.loadTuteurs();
          },
          error: err => {
            console.error("Erreur lors de la suppression du tuteur", err);
            alert("Une erreur s'est produite lors de la suppression.");
          }
        });
    }
  }

  searchNom: string = '';
searchPrenom: string = '';
searchResults: any[] = [];
searchMode: boolean = false;

onSearch(): void {
  if (!this.searchNom.trim() && !this.searchPrenom.trim()) {
    alert('Veuillez saisir un nom ou un prénom.');
    return;
  }

  this.loading = true;
  this.tuteurService.searchTuteurs(this.searchNom, this.searchPrenom).subscribe({
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
  this.searchResults = [];
  this.searchMode = false;
  this.loadTuteurs();
}

} 