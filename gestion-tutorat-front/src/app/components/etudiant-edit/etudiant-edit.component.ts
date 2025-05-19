import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EtudiantService, Etudiant } from '../../services/etudiant/etudiant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-etudiant-edit',
  templateUrl: './etudiant-edit.component.html',
  styleUrls: ['./etudiant-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule]
})
export class EtudiantEditComponent implements OnInit, OnDestroy {
  etudiantForm!: FormGroup;
  submitted = false;
  successMessage = '';
  etudiantId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.etudiantId = idParam ? parseInt(idParam, 10) : null;
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
      departementRattachement: ['']
    });

    if (this.etudiantId !== null) {
      this.etudiantService.getEtudiant(this.etudiantId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: Etudiant) => {
            this.etudiantForm.patchValue({
              emailEcole: data['emailEcole'],
              origine: data['origine'],
              ecole: data['ecole'],
              prenom: data['prenom'],
              nom: data['nom'],
              obligationInternational: data['obligationInternational'],
              stage1A: data['stage1A'],
              codeClasse: data['codeClasse'],
              nomGroupe: data['nomGroupe'],
              langueMajeure: data['langueMajeure'],
              iniAlt: data['iniAlt'],
              entreprise: data['entreprise'],
              fonctionApprenti: data['fonctionApprenti'],
              langue: data['langue'],
              commentaireAffectation: data['commentaireAffectation'],
              departementRattachement: data['departementRattachement']
            });
          },
          error: (err: any) => {
            console.error('Erreur lors du chargement de l’étudiant', err);
          }
        });
    }
  }

  get f() {
    return this.etudiantForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.etudiantForm.invalid || this.etudiantId === null) {
      return;
    }
    const updatedEtudiant: Etudiant = this.etudiantForm.value;
    // (Optionally, convert any comma‐separated fields back into arrays if your back end expects arrays)
    this.etudiantService.update(this.etudiantId, updatedEtudiant)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Etudiant) => {
          this.successMessage = 'Étudiant mis à jour avec succès !';
          this.router.navigate(['/etudiants', this.etudiantId]);

        },
        error: (err: any) => {
          console.error('Erreur lors de la mise à jour de l’étudiant', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
