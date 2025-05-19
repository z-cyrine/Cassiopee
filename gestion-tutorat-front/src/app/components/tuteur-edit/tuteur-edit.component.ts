import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { TuteurService, Tuteur } from '../../services/tuteur/tuteur.service';

@Component({
  standalone: true,
  selector: 'app-tuteur-edit',
  templateUrl: './tuteur-edit.component.html',
  styleUrls: ['./tuteur-edit.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
})
export class TuteurEditComponent implements OnInit, OnDestroy {
  tuteurForm!: FormGroup;
  submitted = false;
  tuteurId!: number;
  private destroy$ = new Subject<void>();
  private formatNamePipe: any;

  constructor(
    private fb: FormBuilder,
    private tuteurService: TuteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* ---------------------------------------------------------------- */
  /* --------------------------- Init -------------------------------- */
  /* ---------------------------------------------------------------- */
  ngOnInit(): void {
    /* id contenu dans l'URL  /tuteurs/edit/:id */
    this.tuteurId = Number(this.route.snapshot.paramMap.get('id'));

    /* construction du formulaire réactif */
    this.tuteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departement: ['', Validators.required],
      estEligiblePourTutorat: [true],
      statut: ['', Validators.required],
      colonne2: [''],
      infoStatut: [''],
      langueTutorat: [''],      /* champs texte => tableau backend */
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
      matieres: [''],           /* idem */
      domainesExpertise: ['']   /* idem */
    });

    this.loadTuteur();
  }

  /* ---------------------------------------------------------------- */
  /* ----------------------- Chargement data ------------------------ */
  /* ---------------------------------------------------------------- */
  private loadTuteur(): void {
    this.tuteurService
      .findOne(this.tuteurId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Tuteur) => {
          /* passages array -> string séparé par virgules pour l'input texte */
          const patched = {
            ...data,
            langueTutorat: Array.isArray(data.langueTutorat)
              ? data.langueTutorat.join(', ')
              : '',
            matieres: Array.isArray(data.matieres)
              ? data.matieres.join(', ')
              : '',
            domainesExpertise: Array.isArray(data.domainesExpertise)
              ? data.domainesExpertise.join(', ')
              : '',
          };
          this.tuteurForm.patchValue(patched);
        },
        error: (err) =>
          console.error('Erreur lors du chargement du tuteur :', err),
      });
  }

  /* getter pratique pour le template */
  get f() {
    return this.tuteurForm.controls;
  }

  /* ---------------------------------------------------------------- */
  /* --------------------------- Submit ----------------------------- */
  /* ---------------------------------------------------------------- */
  onSubmit(): void {
    this.submitted = true;
    if (this.tuteurForm.invalid) return;

    /* Clone + conversion string→array pour les champs JSON */
    const payload: any = { ...this.tuteurForm.value };
    payload.langueTutorat = this.stringToArray(payload.langueTutorat);
    payload.matieres = this.stringToArray(payload.matieres);
    payload.domainesExpertise = this.stringToArray(payload.domainesExpertise);

    this.tuteurService
      .update(this.tuteurId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          /* ✅ pop-up de succès */
          window.alert('Tuteur mis à jour avec succès !');
          /* redirection vers la page détail */
          this.router.navigate(['/tuteurs', this.tuteurId]);
        },
        error: (err) =>
          console.error('Erreur lors de la mise à jour du tuteur :', err),
      });
  }

  /* utilitaire : transforme « a, b ,c » -> ['a','b','c'] */
  private stringToArray(source: string | string[]): string[] {
    return typeof source === 'string'
      ? source
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(source)
      ? source
      : [];
  }

  async formatName(value: string): Promise<string> {
    if (!this.formatNamePipe) {
      const { FormatNamePipe } = await import('../../pipes/format-name/format-name.pipe');
      this.formatNamePipe = new FormatNamePipe();
    }
    return this.formatNamePipe.transform(value);
  }

  async onNameBlur(fieldName: 'nom' | 'prenom') {
    const control = this.tuteurForm.get(fieldName);
    if (control) {
      control.setValue(await this.formatName(control.value));
    }
  }

  /* ---------------------------------------------------------------- */
  /* ----------------------- Destruction ----------------------------- */
  /* ---------------------------------------------------------------- */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
