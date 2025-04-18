import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EtudiantService, Etudiant } from '../../services/etudiant.service';

@Component({
  standalone: true,
  selector: 'app-etudiant-create',
  templateUrl: './etudiant-create.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class EtudiantCreateComponent implements OnInit {
  etudiantForm!: FormGroup;
  submitted = false;
  successMessage = '';

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
    this.etudiantService.createEtudiant(newEtudiant).subscribe({
      next: (res) => {
        this.successMessage = 'Étudiant créé avec succès !';
        console.log('Réponse du serveur:', res);
        // Reset du formulaire
        this.etudiantForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'étudiant', err);
      }
    });
  }
}
