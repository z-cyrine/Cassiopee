import { Component } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TuteurService } from '../../services/tuteur/tuteur.service';

@Component({
  selector: 'app-affectation-manuelle',
  imports: [MatTableModule, CommonModule],
  templateUrl: './affectation-manuelle.component.html',
  styleUrl: './affectation-manuelle.component.css'
})
export class AffectationManuelleComponent {
delete(_t27: any) {
throw new Error('Method not implemented.');
}
edit(_t27: any) {
throw new Error('Method not implemented.');
}
  students: any[] = [];
  columnsStudents: any[] = [];
  tuteurs: any[] = [];
  columnsTuteurs: any[] = [];
  showEdit = true;
  showDelete = true;

  constructor(private etudiantService: EtudiantService, private tuteurService: TuteurService) {}

  ngOnInit() {
    this.etudiantService.getStudents().subscribe({
      next: (response) => {
        this.students = response;
        if (response.length > 0) {
          this.columnsStudents = Object.keys(response[0])
          .filter((key) => key !== 'logs')
          .concat('actions');
        }

        console.log('Students:', this.students);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });

    this.tuteurService.getTuteurs().subscribe({
      next: (response) => {
        this.students = response;
        if (response.length > 0) {
          this.columnsStudents = Object.keys(response[0])
          .concat('actions');
        }
        console.log('Tuteurs:', this.tuteurs);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });
  }

}
