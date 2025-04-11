import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

export interface DialogData {
  name: string;
  tuteurs: Array<any>;
  prenom: string;
}

export interface Tuteur {
  id: number;
  nom: string;
  prenom: string;
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
  constructor(private tuteurService: TuteurService) {}
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
        this.tuteurs = response;
        console.log('Tuteurs:', this.tuteurs);
  
        // ✅ Prénoms disponibles AVANT sélection
        const allPrenoms = Array.from(new Set(this.tuteurs.map(t => t.prenom)));
  
        this.filteredPrenoms$ = this.prenomControl.valueChanges.pipe(
          startWith(''),
          map(value => value?.toLowerCase() || ''),
          map(val => allPrenoms.filter(p => p.toLowerCase().includes(val)))
        );
  
        // ✅ Noms autocomplete
        this.filteredTuteurs$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: string | Tuteur | null): string => typeof value === 'string' ? value : value?.nom ?? ''),
          map((name: string) => name ? this._filter(name) : this.tuteurs.slice())
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
  
}
