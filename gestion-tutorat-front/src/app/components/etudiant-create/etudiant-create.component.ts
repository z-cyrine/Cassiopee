import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EtudiantService, Etudiant } from '../../services/etudiant/etudiant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-etudiant-create',
  templateUrl: './etudiant-create.component.html',
  styleUrls: ['./etudiant-create.component.css'],
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
=======
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
>>>>>>> e1284a246fe886b4f5191b44523b1ef192d80ea5
})
export class EtudiantCreateComponent implements OnInit, OnDestroy {
  etudiantForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  duplicateEmail = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.etudiantForm = this.fb.group({
      emailEcole: ['', [Validators.required, Validators.email]],
      origine: ['', Validators.required],
      ecole: ['', Validators.required],
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      obligationInternational: ['', Validators.required],
      stage1A: ['', Validators.required],
      codeClasse: ['', Validators.required],
      nomGroupe: ['', Validators.required],
      langueMajeure: ['', Validators.required],
      iniAlt: ['', Validators.required],
      entreprise: [''],
      fonctionApprenti: [''],
      langue: [''],
      commentaireAffectation: [''],
      departementRattachement: [''],
    });
  }

  /** Accès pratique aux contrôles depuis le template */
  get f() {
    return this.etudiantForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.duplicateEmail = false;

    if (this.etudiantForm.invalid) {
      return;
    }

    const newEtudiant: Etudiant = this.etudiantForm.value;

    this.etudiantService
      .createEtudiant(newEtudiant)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created: Etudiant) => {
          this.successMessage = 'Étudiant créé avec succès !';
          setTimeout(() => {
            this.router.navigate(['/etudiants', created.id]);
          }, 1000);
        },
error: (err) => {
  console.error('Erreur lors de la création', err);
  console.log('Raw err.error:', err?.error);

  try {
    const backend = err?.error;
    const nestedMessage = backend?.message;

    if (nestedMessage?.duplicate) {
      this.errorMessage = nestedMessage.message || 'Cet e-mail est déjà utilisé.';
    } else if (typeof nestedMessage === 'string') {
      this.errorMessage = nestedMessage;
    } else {
      this.errorMessage = JSON.stringify(nestedMessage || backend || err);
    }
  } catch (e) {
    console.error('Parsing failed:', e);
    this.errorMessage = 'Erreur inattendue lors de la création.';
  }
}
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
