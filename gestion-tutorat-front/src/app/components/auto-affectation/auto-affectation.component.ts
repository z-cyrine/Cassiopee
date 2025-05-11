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
