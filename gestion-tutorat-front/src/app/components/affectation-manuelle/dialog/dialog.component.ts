import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { TuteurService } from '../../../services/tuteur/tuteur.service';

export interface DialogData {
  animal: string;
  name: string;
  tuteurs: Array<any>; // Array of tutor objects
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
})
export class DialogComponent implements OnInit {
  constructor(private tuteurService: TuteurService) {}

  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  tuteur: string = '';
  filteredTuteurs: any[] = [];
  tuteurs: any[] = [];

  filteredTuteursObservable!: Observable<any[]>;

  ngOnInit(): void {
    this.tuteurService.getTuteurs().subscribe({
      next: (response) => {
        this.tuteurs = response;
        console.log('Tuteurs:', this.tuteurs);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });

    this.filteredTuteurs = this.tuteurs;

    // Set up the observable for filtering tuteurs based on user input
    this.filteredTuteursObservable = of(this.filteredTuteurs).pipe(
      startWith([]),
      map((tutorList: any[]) => this.filterTuteurs(tutorList))
    );
  }

  // Filter function to filter tutors based on the user input
  filterTuteurs(tutorList: any[]): any[] {
    const filterValue = this.tuteur.toLowerCase();
    return tutorList.filter(tutor => tutor.nom.toLowerCase().includes(filterValue));
  }

  // This function is called when a tuteur is selected from the list
  onTuteurSelected(event: any): void {
    this.tuteur = event.option.value; // Set the selected tuteur's name to input field
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
