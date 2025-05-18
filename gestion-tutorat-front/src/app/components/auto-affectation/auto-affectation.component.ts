// auto-affectation.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/table/table.component';
import { AffectationResult, AffectationService } from '../../services/affectation/affectation.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auto-affectation',
  standalone: true,
  imports: [CommonModule, TableComponent, FormsModule, TranslateModule],
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

  lastUpdated: Date | null = null;
  isCache: boolean = true;
  stats: any = null;
  showLogModal = false;
  logModalContent = '';

  constructor(private affectationService: AffectationService, private translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.setupColumns();
    });
  }

  ngOnInit(): void {
    this.loadEtatAffectation();
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
        next: (res: AffectationResult & { lastUpdated?: string | Date, stats?: any }) => {
          console.log('Données reçues (auto):', res.details);
          this.result = res;
          this.data = res.details;
          this.page = 1;
          this.pageCount = Math.ceil(this.data.length / this.limit) || 1;
          this.updatePagedData();
          this.setupColumns();
          this.loading = false;
          this.lastUpdated = res.lastUpdated ? new Date(res.lastUpdated) : null;
          this.stats = res.stats || null;
          this.isCache = false;
        },
        error: (err) => {
          console.error(err);
          this.error = "Erreur lors de l'affectation";
          this.loading = false;
        }
      });
  }

  loadEtatAffectation(): void {
    this.loading = true;
    this.error = null;
    this.affectationService.getEtatAffectation()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AffectationResult & { lastUpdated?: string | Date, stats?: any }) => {
          console.log('Données reçues (état):', res.details);
          this.result = res;
          this.data = res.details;
          this.page = 1;
          this.pageCount = Math.ceil(this.data.length / this.limit) || 1;
          this.updatePagedData();
          this.setupColumns();
          this.loading = false;
          this.lastUpdated = res.lastUpdated ? new Date(res.lastUpdated) : null;
          this.stats = res.stats || null;
          this.isCache = true;
        },
        error: (err) => {
          console.error(err);
          this.error = "Erreur lors de la récupération de l'état";
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
      { columnDef: 'etudiantId', header: 'STUDENTS.ID', cell: (e: any) => String(e.etudiantId || '') },
      { columnDef: 'nom', header: 'COMMON.LASTNAME', cell: (e: any) => e.nom || '' },
      { columnDef: 'prenom', header: 'COMMON.FIRSTNAME', cell: (e: any) => e.prenom || '' },
      { columnDef: 'emailEcole', header: 'STUDENTS.SCHOOL_EMAIL', cell: (e: any) => e.emailEcole || '' },
      { columnDef: 'codeClasse', header: 'STUDENTS.CLASS_CODE', cell: (e: any) => e.codeClasse || '' },
      { columnDef: 'nomGroupe', header: 'STUDENTS.GROUP_NAME', cell: (e: any) => e.nomGroupe || '' },
      { columnDef: 'langue', header: 'TUTORS.LANGUE_TUTORAT', cell: (e: any) => e.langue || '' },
      { columnDef: 'iniAlt', header: 'STUDENTS.INI_ALT', cell: (e: any) => e.iniAlt || '' },
      { columnDef: 'tutorNom', header: 'TUTORS.LASTNAME', cell: (e: any) => e.tutorNom || '' },
      { columnDef: 'tutorPrenom', header: 'TUTORS.FIRSTNAME', cell: (e: any) => e.tutorPrenom || '' },
      { columnDef: 'tutorDept', header: 'TUTORS.DEPARTMENT', cell: (e: any) => e.tutorDept || '' },
      { columnDef: 'assigned', header: 'STUDENTS.ASSIGNED', cell: (e: any) => e.assigned ? this.translate.instant('STUDENTS.YES') : this.translate.instant('STUDENTS.NO') },
      { columnDef: 'logs', header: 'AUTO_AFFECT.LOGS', cell: (e: any) => Array.isArray(e.logs) ? e.logs.join(' | ') : (e.logs || '') },
    ];
  }

  resetAffectation(): void {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les affectations ?')) {
      this.loading = true;
      this.affectationService.resetAffectation().subscribe({
        next: () => {
          this.loadEtatAffectation();
        },
        error: (err) => {
          this.error = "Erreur lors de la réinitialisation";
          this.loading = false;
        }
      });
    }
  }

  openLogModal(logs: string) {
    this.logModalContent = logs;
    this.showLogModal = true;
  }
  closeLogModal() {
    this.showLogModal = false;
    this.logModalContent = '';
  }

  formatDate(date: Date | null): string {
    return date ? formatDate(date, 'dd/MM/yyyy HH:mm:ss', 'fr-FR') : '';
  }

  toggleFrozenEtudiant(etudiant: any): void {
    const action = etudiant.frozen ? 'unfreeze' : 'freeze';
    this.affectationService.toggleFrozen(etudiant.etudiantId, action).subscribe({
      next: () => {
        etudiant.frozen = !etudiant.frozen;
        this.loadEtatAffectation();
      },
      error: (err: any) => {
        console.error('Erreur lors du changement de statut figé:', err);
        this.error = "Erreur lors du changement de statut figé";
      }
    });
  }
}
