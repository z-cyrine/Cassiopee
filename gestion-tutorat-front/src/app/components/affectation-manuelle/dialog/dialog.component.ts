import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { TuteurService } from '../../../services/tuteur/tuteur.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { Tuteur } from '../../../services/tuteur/tuteur.service';

export interface DialogData {
  name: string;
  tuteurs: Array<any>;
  prenom: string;
  etudiantId: number;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    CommonModule
  ],
})
export class DialogComponent implements OnInit {
  constructor(private tuteurService: TuteurService, private snackBar: MatSnackBar) {}

  @Output() etudiantAffecte = new EventEmitter<{ etudiantId: number; tuteur: Tuteur }>();

  myControl = new FormControl('');
  filteredTuteurs$: Observable<any[]> = of([]);

  //NOM CONTROL
  tuteurs: any[] = [];
  filteredTuteurs: Tuteur[] = [];

  //PRENOM CONTROL
  prenomControl = new FormControl('');
  filteredPrenoms$: Observable<string[]> = of([]);


  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  tuteur: string = '';
  nomSelectionné: string = '';
  prenomSelectionné: string = '';


  ngOnInit(): void {
    this.tuteurService.getTuteurs().subscribe({
      next: (response) => {
        this.tuteurs = response.filter((t: Tuteur) => t.soldeTutoratRestant > 0);
        console.log('Tuteurs:', this.tuteurs);
  
        // ✅ Prénoms disponibles AVANT sélection
        const allPrenoms = Array.from(new Set(this.tuteurs.map(t => t.prenom)));
  
        this.filteredPrenoms$ = this.prenomControl.valueChanges.pipe(
          startWith(''),
          map(value => value?.toLowerCase() || ''),
          map(val => {
            const prenoms = this.tuteurs
              .filter(t => t.soldeTutoratRestant > 0)
              .map(t => t.prenom)
              .filter(p => p.toLowerCase().includes(val));
        
            return prenoms.length > 0 ? prenoms : ['Aucun tuteur disponible'];
          })
        );
        
  
        // ✅ Noms autocomplete
        this.filteredTuteurs$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: string | Tuteur | null): string => typeof value === 'string' ? value : value?.nom ?? ''),
          map((name: string) => {
            const filtered = name
              ? this.tuteurs
                  .filter(t => t.soldeTutoratRestant > 0)
                  .filter(t => t.nom.toLowerCase().includes(name.toLowerCase()))
              : this.tuteurs.filter(t => t.soldeTutoratRestant > 0);
        
            return filtered.length > 0 ? filtered : [{ nom: 'Aucun tuteur disponible', prenom: '', id: -1 }];
          })
        );
        
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });
  }
  

  displayFn(tuteur: Tuteur | null): string {
    return tuteur ? tuteur.nom : '';
  }  

  private _filter(name: string): Tuteur[] {
    const filterValue = name.toLowerCase();
    return this.tuteurs.filter(tuteur => tuteur.nom.toLowerCase().includes(filterValue));
  }

  // Filter function to filter tutors based on the user input
  filterTuteurs(tutorList: any[]): any[] {
    const filterValue = this.tuteur.toLowerCase();
    return tutorList.filter(tutor => tutor.nom.toLowerCase().includes(filterValue));
  }

  // This function is called when a tuteur is selected from the list
  onTuteurSelected(event: any): void {
    const selectedTuteur = event.option.value;
    this.nomSelectionné = selectedTuteur.nom; 
    console.log('Nom sélectionné:', this.nomSelectionné);
    const matchingTuteurs = this.tuteurs.filter(t => t.nom === selectedTuteur.nom);
    const matchingPrenoms = matchingTuteurs.map(t => t.prenom);

    // Si un seul prénom => l'auto-remplir
    if (matchingPrenoms.length === 1) {
      this.prenomSelectionné = matchingPrenoms[0];
      this.prenomControl.setValue(matchingPrenoms[0]);
    } else {
      this.prenomSelectionné = '';
      this.prenomControl.setValue('');
    }

    // Préparer l'autocomplete pour prénom
    this.filteredPrenoms$ = this.prenomControl.valueChanges.pipe(
      startWith(''),
      map(value => value?.toLowerCase() || ''),
      map(val => matchingPrenoms.filter(p => p.toLowerCase().includes(val)))
    );
  }

  //PRENOM AUTOCOMPLETE
  onPrenomSelected(event: any): void {
    this.prenomSelectionné = event.option.value;
  
    const matchingTuteurs = this.tuteurs.filter(t => t.prenom === this.prenomSelectionné);
  
    if (matchingTuteurs.length === 1) {
      const tuteurUnique = matchingTuteurs[0];
      this.nomSelectionné = tuteurUnique.nom;
      this.myControl.setValue(tuteurUnique); // ✅ on donne un objet, pas juste une string
    } else {
      this.nomSelectionné = '';
      this.myControl.setValue('');
    }
  
    this.filteredTuteurs$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => value?.toLowerCase?.() || ''),
      map(val => {
        const noms = matchingTuteurs.map(t => t.nom);
        return noms.length
          ? this.tuteurs.filter(t => noms.includes(t.nom) && t.nom.toLowerCase().includes(val))
          : this.tuteurs.slice();
      })
    );
  }
  
  
  displayPrenom(tuteur: Tuteur | string | null): string {
    if (typeof tuteur === 'string') return tuteur;
    return tuteur?.prenom ?? '';
  }
  
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetChamps(): void {
    this.myControl.setValue('');
    this.prenomControl.setValue('');
    this.nomSelectionné = '';
    this.prenomSelectionné = '';
  
    // Remettre les suggestions à l’état initial
    this.filteredPrenoms$ = this.prenomControl.valueChanges.pipe(
      startWith(''),
      map(value => value?.toLowerCase() || ''),
      map(val => Array.from(new Set(this.tuteurs.map(t => t.prenom)))
        .filter(p => p.toLowerCase().includes(val)))
    );
  
    this.filteredTuteurs$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: string | Tuteur | null): string => typeof value === 'string' ? value : value?.nom ?? ''),
      map(name => name ? this._filter(name) : this.tuteurs.slice())
    );
  }

  affecter() {
    const tuteur = this.tuteurs.find(t =>
      t.nom === this.nomSelectionné &&
      t.prenom === this.prenomSelectionné
    );

    if (!tuteur) {
      this.snackBar.open('Aucun tuteur correspondant trouvé.', 'Fermer', {
        duration: 2000,
        panelClass: ['snack-error']
      });
      return;
    }

    console.log('Étudiant ID:', this.data.etudiantId);

    this.tuteurService.affecterEtudiant(this.data.etudiantId, tuteur.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open(res.message, 'Fermer', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.etudiantAffecte.emit({ etudiantId: res.etudiant.id, tuteur: res.tuteur });
          this.dialogRef.close(res.etudiant); // ou res.tuteur selon ton besoin
        } else {
          this.snackBar.open(res.message, 'Fermer', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      },
      error: () => {
        this.snackBar.open('Erreur technique, veuillez réessayer.', 'Fermer', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
    }
  
}
