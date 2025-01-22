import { Component } from '@angular/core';
import { TableComponent } from '../shared/table/table.component';


@Component({
  selector: 'app-affiche-etudiants',
  imports: [TableComponent],
  templateUrl: './affiche-etudiants.component.html',
  styleUrl: './affiche-etudiants.component.css'
})
export class AfficheEtudiantsComponent {

  columns = [
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    { columnDef: 'name', header: 'Name', cell: (element: any) => `${element.name}` },
    { columnDef: 'major', header: 'Major', cell: (element: any) => `${element.major}` }
  ];

  // Example data for students
  data = [
    { id: 1, name: 'Alice Dupont', major: 'Finance' },
    { id: 2, name: 'Bob Martin', major: 'Marketing' },
    { id: 3, name: 'Charlie Durand', major: 'Informatique' }
  ];

  // Options to show actions
  showEdit = true;
  showDelete = true;
}
