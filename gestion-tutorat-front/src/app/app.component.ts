import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImportComponent } from './components/import/import.component';
import { AfficheEtudiantsComponent } from "./affiche-etudiants/affiche-etudiants.component";
import { TableComponent } from "./shared/table/table.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [ImportComponent, AfficheEtudiantsComponent, TableComponent],
})
export class AppComponent {
  title = 'gestion-tutorat-front';
}
