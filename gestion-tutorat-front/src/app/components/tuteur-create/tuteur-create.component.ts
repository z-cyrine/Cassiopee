import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuteurService, Tuteur } from '../../services/tuteur/tuteur.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { TranslateModule } from '@ngx-translate/core';
=======
>>>>>>> e1284a246fe886b4f5191b44523b1ef192d80ea5

@Component({
  standalone: true,
  selector: 'app-tuteur-create',
  templateUrl: './tuteur-create.component.html',
  styleUrls: ['./tuteur-create.component.css'],
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
=======
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
>>>>>>> e1284a246fe886b4f5191b44523b1ef192d80ea5
})
export class TuteurCreateComponent implements OnInit, OnDestroy {
  tuteurForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private tuteurService: TuteurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tuteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departement: ['', Validators.required],
      estEligiblePourTutorat: [true],
      statut: ['', Validators.required],
      colonne2: [''],
      infoStatut: [''],
      langueTutorat: [''],
      profil: ['', Validators.required],
      parTutoratAlt: [0, Validators.min(0)],
      tutoratAltAff: [0, Validators.min(0)],
      soldeAlt: [0, Validators.min(0)],
      parTutoratIni: [0, Validators.min(0)],
      tutoratIniAff: [0, Validators.min(0)],
      soldeIni: [0, Validators.min(0)],
      totalEtudiantsPar: [0, Validators.min(0)],
      nbTutoratAffecte: [0, Validators.min(0)],
      soldeTutoratRestant: [0, Validators.min(0)],
      matieres: [''],
      domainesExpertise: ['']
    });
  }

  get f() {
    return this.tuteurForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.tuteurForm.invalid) return;

    const formValue = { ...this.tuteurForm.value };

    formValue.langueTutorat = formValue.langueTutorat
      ? formValue.langueTutorat.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    formValue.matieres = formValue.matieres
      ? formValue.matieres.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    formValue.domainesExpertise = formValue.domainesExpertise
      ? formValue.domainesExpertise.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const newTuteur: Tuteur = formValue;

    this.tuteurService.createTuteur(newTuteur)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created: Tuteur) => {
          this.successMessage = 'Tuteur créé avec succès !';
          setTimeout(() => this.router.navigate(['/tuteurs', created.id]), 1000);
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
