import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuteurService, Tuteur } from '../../services/tuteur/tuteur.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tuteur-edit',
  templateUrl: './tuteur-edit.component.html',
  styleUrls: ['./tuteur-edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TuteurEditComponent implements OnInit, OnDestroy {
  tuteurForm!: FormGroup;
  submitted = false;
  tuteurId!: number;
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private tuteurService: TuteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tuteurId = Number(this.route.snapshot.paramMap.get('id'));
    // Initialize the form with default values.
    this.tuteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departement: ['', Validators.required],
      estEligiblePourTutorat: [true],
      statut: ['', Validators.required],
      colonne2: [''],
      infoStatut: [''],
      // We use a plain text input for these array fields; they will be comma‐separated.
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
    this.loadTuteur();
  }

  loadTuteur(): void {
    this.tuteurService.findOne(this.tuteurId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Tuteur) => {
          // Convert arrays into comma‐separated strings for the form inputs.
          const patchedData = {
            ...data,
            langueTutorat: Array.isArray(data.langueTutorat) ? data.langueTutorat.join(', ') : '',
            matieres: Array.isArray(data.matieres) ? data.matieres.join(', ') : '',
            domainesExpertise: Array.isArray(data.domainesExpertise) ? data.domainesExpertise.join(', ') : ''
          };
          this.tuteurForm.patchValue(patchedData);
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement du tuteur', err);
        }
      });
  }

  // For easy access to form controls in the template.
  get f() {
    return this.tuteurForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.tuteurForm.invalid) {
      return;
    }

    // Get a clone of the form values.
    const formValue = { ...this.tuteurForm.value };

    // For fields that are stored as arrays in the backend,
    // split the comma-separated strings into arrays (after trimming each element).
    formValue.langueTutorat =
      (typeof formValue.langueTutorat === 'string' && formValue.langueTutorat) ?
        formValue.langueTutorat.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
    formValue.matieres =
      (typeof formValue.matieres === 'string' && formValue.matieres) ?
        formValue.matieres.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
    formValue.domainesExpertise =
      (typeof formValue.domainesExpertise === 'string' && formValue.domainesExpertise) ?
        formValue.domainesExpertise.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];

    this.tuteurService.update(this.tuteurId, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Tuteur) => {
          this.successMessage = 'Tuteur mis à jour avec succès !';
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du tuteur', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
