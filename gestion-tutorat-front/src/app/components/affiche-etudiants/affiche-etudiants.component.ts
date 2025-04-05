import { Component, OnInit } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; // Required for mat-table
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-affiche-etudiants',
  standalone: true,
  imports: [FormsModule, MatTableModule, CommonModule],
  templateUrl: './affiche-etudiants.component.html',
  styleUrls: ['./affiche-etudiants.component.css'],
})
export class AfficheEtudiantsComponent implements OnInit {
  tauxAffectation: number=80 ;
  tauxAffectationInput: number = this.tauxAffectation;

  students: any[] = [];
  columns: any[] = [];
  showEdit = true;
  showDelete = true;

  constructor(private etudiantService: EtudiantService) {}

  ngOnInit() {
    this.etudiantService.getStudents().subscribe({
      next: (response) => {
        this.students = response;
        if (response.length > 0) {
          this.columns = Object.keys(response[0])
          .filter((key) => key !== 'logs')
          .concat('actions');
        }
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });
  }
  

  private formatHeader(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private extractNestedData(element: any, key: string): any {
    const keys = key.split('.'); 
    return keys.reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : ''), element);
  }

  viewResults() {
    console.log('View results');
    }

  updateTauxAffectation() {
    if (this.tauxAffectationInput >= 0 && this.tauxAffectationInput <= 100) {
      this.tauxAffectation = this.tauxAffectationInput;
      console.log(`Taux d'affectation updated to ${this.tauxAffectation}%`);
    } else {
      alert('Please enter a valid percentage between 0 and 100.');
    }
    }

    edit(element: any): void {
      console.log('Edit:', element);
    }
  
    delete(element: any): void {
      console.log('Delete:', element);
    }

}
