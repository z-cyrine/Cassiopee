import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../shared/table/table.component';
import { EtudiantService } from '../services/etudiant/etudiant.service';

@Component({
  selector: 'app-affiche-etudiants',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './affiche-etudiants.component.html',
  styleUrls: ['./affiche-etudiants.component.css'],
})
export class AfficheEtudiantsComponent implements OnInit {
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
          this.columns = Object.keys(response[0]).map((key) => ({
            columnDef: key,
            header: this.formatHeader(key),
            cell: (element: any) => this.extractNestedData(element, key),
          }));
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
}
