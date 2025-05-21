import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MajorsService } from '../../services/majors/majors.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-majeure-edit',
  templateUrl: './majeure-edit.component.html',
  styleUrls: ['./majeure-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule]
})
export class MajeureEditComponent implements OnInit, OnDestroy {
  majeureForm!: FormGroup;
  submitted = false;
  successMessage = '';
  majeureId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private majorsService: MajorsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.majeureId = idParam ? parseInt(idParam, 10) : null;

    this.majeureForm = this.fb.group({
      code: ['', Validators.required],
      groupe: ['', Validators.required],
      dept: ['', Validators.required],
      responsible: ['', Validators.required],
      langue: ['', Validators.required],
      iniAlt: ['', Validators.required],
      programme: ['', Validators.required]
    });

    if (this.majeureId !== null) {
      this.majorsService.getMajeure(this.majeureId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            this.majeureForm.patchValue({
              code: data.code,
              groupe: data.groupe,
              dept: data.dept,
              responsible: data.responsible || data.responsable,
              langue: this.mapLangueToOption(data.langue),
              iniAlt: data.iniAlt,
              programme: data.programme
            });
          },
          error: (err: any) => {
            console.error('Erreur lors du chargement de la majeure', err);
          }
        });
    }
  }

  get f() {
    return this.majeureForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.majeureForm.invalid || this.majeureId === null) {
      return;
    }

    const updatedMajeure = this.majeureForm.value;

    this.majorsService.updateMajeure(this.majeureId, updatedMajeure)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Majeure mise à jour avec succès !';
          this.router.navigate(['/majeures', this.majeureId]);
        },
        error: (err: any) => {
          console.error('Erreur lors de la mise à jour de la majeure', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapLangueToOption(langue: string): string {
    if (!langue) return '';
    const l = langue.trim().toUpperCase();
    // On normalise les séparateurs
    const normalized = l.replace(/[\\/,&]/g, ' ').replace(/\s+/g, ' ');
    const hasFR = normalized.includes('FR') || normalized.includes('FRANÇAIS');
    const hasEN = normalized.includes('EN') || normalized.includes('ANGLAIS');
    if (hasFR && hasEN) return 'FR,EN';
    if (hasFR) return 'FR';
    if (hasEN) return 'EN';
    return '';
  }
}
