import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EtudiantService, Etudiant } from '../../services/etudiant/etudiant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-etudiant-create',
  templateUrl: './etudiant-create.component.html',
  styleUrls: ['./etudiant-create.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class EtudiantCreateComponent implements OnInit, OnDestroy {
  etudiantForm!: FormGroup;
  submitted = false;
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private etudiantService: EtudiantService) {}

  ngOnInit() {
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
  }

  get f() {
    return this.etudiantForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Si le formulaire est invalide, on arrête
    if (this.etudiantForm.invalid) {
      return;
    }

    // Conversion en type Etudiant
    const newEtudiant: Etudiant = this.etudiantForm.value;

    // Appel au service pour créer l'étudiant
    this.etudiantService.createEtudiant(newEtudiant)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Étudiant créé avec succès !';
          console.log('Réponse du serveur:', res);
          // Reset du formulaire
          this.etudiantForm.reset();
          this.submitted = false;
        },
        error: (err: any) => {
          console.error('Erreur lors de la création de l\'étudiant', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
