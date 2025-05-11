import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuteurService, Tuteur } from '../../services/tuteur.service';

@Component({
  standalone: true,
  selector: 'app-tuteur-create',
  templateUrl: './tuteur-create.component.html',
  styleUrls: ['./tuteur-create.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class TuteurCreateComponent implements OnInit {
  tuteurForm!: FormGroup;
  submitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private tuteurService: TuteurService) {}

  ngOnInit() {
    this.tuteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departement: ['', Validators.required],
      estEligiblePourTutorat: [true],
      statut: ['', Validators.required],
      colonne2: [''],
      infoStatut: [''],
      // We use a string input which will be converted into an array (comma separated)
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
      // Similarly for the array fields
      matieres: [''],
      domainesExpertise: ['']
    });
  }

  get f() {
    return this.tuteurForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.tuteurForm.invalid) {
      return;
    }

    // Clone the form value
    const formValue = { ...this.tuteurForm.value };

    // Convert comma-separated string fields into arrays.
    formValue.langueTutorat = formValue.langueTutorat
      ? formValue.langueTutorat.split(',').map((s: string) => s.trim()).filter((s: string) => s)
      : [];
    formValue.matieres = formValue.matieres
      ? formValue.matieres.split(',').map((s: string) => s.trim()).filter((s: string) => s)
      : [];
    formValue.domainesExpertise = formValue.domainesExpertise
      ? formValue.domainesExpertise.split(',').map((s: string) => s.trim()).filter((s: string) => s)
      : [];

    const newTuteur: Tuteur = formValue;

    this.tuteurService.createTuteur(newTuteur).subscribe({
      next: (res) => {
        this.successMessage = 'Tuteur créé avec succès !';
        this.tuteurForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création du tuteur', err);
      }
    });
  }
}
