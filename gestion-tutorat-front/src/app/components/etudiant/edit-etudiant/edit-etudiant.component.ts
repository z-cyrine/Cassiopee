import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EtudiantService } from '../../../services/etudiant.service';

@Component({
  selector: 'app-edit-etudiant',
  imports: [],
  templateUrl: './edit-etudiant.component.html',
  styleUrl: './edit-etudiant.component.css'
})
export class EditEtudiantComponent implements OnInit {
  etudiantForm!: FormGroup;
  etudiantId!: number;

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.etudiantId = +this.route.snapshot.paramMap.get('id')!;
    this.etudiantForm = this.fb.group({
      prenom: [''],
      nom: [''],
      emailEcole: [''],
      origine: [''],
      ecole: [''],
      groupe: [''],
      iniAlt: [''],
      entreprise: [''],
      commentaireAffectation: [''],
      langueTutorat: [''],
      soutenanceDate: [''],
      soutenanceHoraire: [''],
      soutenanceSalle: [''],
      membreJury1: [''],
      membreJury2: [''],
    });

    this.loadEtudiant();
  }

  loadEtudiant() {
    this.etudiantService.getEtudiant(this.etudiantId).subscribe((data) => {
      this.etudiantForm.patchValue(data);
    });
  }

  updateEtudiant() {
    this.etudiantService
      .updateEtudiant(this.etudiantId, this.etudiantForm.value)
      .subscribe(() => {
        alert('Etudiant updated successfully');
      });
  }

}
