import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-tuteur',
  imports: [],
  templateUrl: './edit-tuteur.component.html',
  styleUrl: './edit-tuteur.component.css'
})
export class EditTuteurComponent  implements OnInit {

  tuteurForm!: FormGroup;
  tuteurId!: number;

  constructor(
    private fb: FormBuilder,
    private tuteurService: TuteurService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tuteurId = +this.route.snapshot.paramMap.get('id')!;
    this.tuteurForm = this.fb.group({
      prenom: [''],
      nom: [''],
      email: [''],
      departement: [''],
      estEligiblePourTutorat: [false],
      langueTutorat: [[]],
      parTutoratAlt: [0],
      parEquivalentIni: [0],
      tutoratAltAff: [0],
      parTutoratIni: [0],
      tutoratIniAff: [0],
      totalTutoratAff: [0],
      participationJury: [0],
      matieres: [[]],
      totalEtudiantsPar: [0],
      ecartAff: [0],
      telephone: [''],
    });

    this.loadTuteur();
  }

  loadTuteur() {
    this.tuteurService.getTuteur(this.tuteurId).subscribe((data) => {
      this.tuteurForm.patchValue(data);
    });
  }

  updateTuteur() {
    this.tuteurService
      .updateTuteur(this.tuteurId, this.tuteurForm.value)
      .subscribe(() => {
        alert('Tuteur updated successfully');
      });
  }

}
