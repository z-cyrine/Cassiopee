// auto-affectation.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/table/table.component';
import { AffectationResult, AffectationService } from '../../services/affectation/affectation.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-auto-affectation',
  standalone: true,
  imports: [CommonModule, TableComponent, FormsModule],
  templateUrl: './auto-affectation.component.html',
  styleUrls: ['./auto-affectation.component.css']
})
export class AutoAffectationComponent implements OnInit, OnDestroy {
  result: AffectationResult | null = null;
  data: any[] = [];
  columns: { columnDef: string; header: string; cell: (element: any) => string }[] = [];
  loading = false;
  error: string | null = null;
  equivalence = 2;
  private destroy$ = new Subject<void>();

  // Pagination
  page = 1;
  limit = 20;
  pageCount = 1;
  pagedData: any[] = [];

  constructor(private affectationService: AffectationService) {}

  ngOnInit(): void {
    this.loadAffectation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAffectation(): void {
    this.loading = true;
    this.error = null;
    this.affectationService.runAffectation(this.equivalence)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AffectationResult) => {
          this.result = res;
          this.data = res.details;
          this.page = 1;
          this.pageCount = Math.ceil(this.data.length / this.limit) || 1;
          this.updatePagedData();
          this.setupColumns();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = "Erreur lors de l'affectation";
          this.loading = false;
        }
      });
  }

  updatePagedData() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    this.pagedData = this.data.slice(start, end);
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
      this.updatePagedData();
    }
  }
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagedData();
    }
  }
  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.pageCount) {
      this.page = pageNum;
      this.updatePagedData();
    }
  }
  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.pageCount, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  setupColumns(): void {
    this.columns = [
      { columnDef: 'etudiantId', header: 'ID', cell: (e: any) => String(e.etudiantId || '') },
      { columnDef: 'nom', header: 'Nom Étudiant', cell: (e: any) => e.nom || '' },
      { columnDef: 'prenom', header: 'Prénom Étudiant', cell: (e: any) => e.prenom || '' },
      { columnDef: 'emailEcole', header: 'Email École', cell: (e: any) => e.emailEcole || '' },
      { columnDef: 'codeClasse', header: 'Code Classe', cell: (e: any) => e.codeClasse || '' },
      { columnDef: 'nomGroupe', header: 'Nom Groupe', cell: (e: any) => e.nomGroupe || '' },
      { columnDef: 'langue', header: 'Langue Tutorat', cell: (e: any) => e.langue || '' },
      { columnDef: 'iniAlt', header: 'Type', cell: (e: any) => e.iniAlt || '' },
      // Colonnes d'infos du tuteur
      { columnDef: 'tutorNom', header: 'Tutor Nom', cell: (e: any) => e.tutorNom || '' },
      { columnDef: 'tutorPrenom', header: 'Tutor Prénom', cell: (e: any) => e.tutorPrenom || '' },
      { columnDef: 'tutorDept', header: 'Tutor Département', cell: (e: any) => e.tutorDept || '' },
      // Logs d'affectation
      { columnDef: 'assigned', header: 'Affectation', cell: (e: any) => e.assigned ? 'Assigné' : 'À traiter manuellement'},
      { columnDef: 'logs', header: 'Logs', cell: (e: any) => e.logs ? e.logs.join(' | ') : '' },
    ];
  }
}
