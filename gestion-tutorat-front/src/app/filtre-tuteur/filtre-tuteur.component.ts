import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReportingService } from '../services/reporting/reporting.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filtre-tuteur',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, TranslateModule],
  templateUrl: './filtre-tuteur.component.html',
  styleUrl: './filtre-tuteur.component.css'
})
export class FiltreTuteurComponent {
  @Input() tuteurs: any[] = [];
  @Output() onFilter = new EventEmitter<any>();

  profils: string[] = [];
  departements: string[] = [];

  showNom = false;
  nomFilter = '';
  prenomFilter = '';

  showProfil = false;
  selectedProfil = 'Tous';

  showDepartement = false;
  selectedDepartement = 'Tous';

  showSoldeRestant = false;
  minSoldeRestant: number = 0;

  showNbAffectes = false;
  minNbAffectes: number = 0;

  panelVisible = false;

  constructor(private reportingService: ReportingService) {}

  ngOnInit() {
    this.reportingService.getDistinctDepartments().subscribe((deps) => {
      this.departements = deps;
    });
    this.reportingService.getDistinctProfils().subscribe((data) => {
      this.profils = data;
    });
    this.reportingService.getDistinctDepartments().subscribe((data) => {
      this.departements = data;
    });
  }

  togglePanel(event: MouseEvent) {
    event.stopPropagation();
    this.panelVisible = !this.panelVisible;
  }

  @HostListener('document:click')
  closePanel() {
    this.panelVisible = false;
  }

  applyFilters() {
    const filters = {
      nom: this.nomFilter,
      prenom: this.prenomFilter,
      profil: this.selectedProfil,
      departement: this.selectedDepartement,
      soldeRestant: this.minSoldeRestant,
      nbAffectes: this.minNbAffectes,
      showNom: this.showNom,
      showProfil: this.showProfil,
      showDepartement: this.showDepartement,
      showSoldeRestant: this.showSoldeRestant,
      showNbAffectes: this.showNbAffectes,
    };
    this.onFilter.emit(filters);
  }

  reinitialiser() {
    this.nomFilter = '';
    this.prenomFilter = '';
    this.selectedProfil = 'Tous';
    this.selectedDepartement = 'Tous';
    this.minSoldeRestant = 0;
    this.minNbAffectes = 0;
    this.applyFilters();
  }
}
