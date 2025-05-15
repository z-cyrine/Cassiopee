import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportingService } from '../../services/reporting/reporting.service';

@Component({
  selector: 'app-filtre-etudiants',
  imports: [MatButtonToggleModule, MatExpansionModule, CommonModule, FormsModule],
  templateUrl: './filtre-etudiants.component.html',
  styleUrl: './filtre-etudiants.component.css'
})
export class FiltreEtudiantsComponent {
  constructor(private reportingService: ReportingService) { }

  @Input() students: any = [];
  @Output() onFilter = new EventEmitter<any>();


  showAffectation: any = false;
  affectations = ['Tous','Affecté', 'Non affecté'];
  selectedAffectation: any = 'Tous';

  //NOM ET PRENOM
  showNom: any = false;
  lastNameFilter: string = '';
  firstNameFilter: string = '';

  //CODES EMA ENI 8LOTET FEL TASMYA
  codes: string[] = [];
  showdep: any = false;
  selecteddep: any = 'Tous';  


  // DEPARTEMENTS
  departements: string[] = [];
  showdepartement: any = false;
  selecteddepartement: any = 'Tous';  
  

  ngOnInit() {
    this.loadDepartments();
     this.reportingService.getDistinctCodeClasses().subscribe({
      next: (codes) => this.codes = codes,
      error: (err) => console.error('Erreur chargement codeClasse', err)
    });
  }


  // Filter
  filterVisible=false;
  readonly panelOpenState = signal(false);

  filters = {
    affectation: this.selectedAffectation,
    lastName: this.lastNameFilter,
    firstName: this.firstNameFilter,
    dep: this.selecteddep,
    departement: this.selecteddepartement,
    showAffectation: this.showAffectation,
    showdep: this.showdep,
    showNom: this.showNom,
    showDepartement: this.showdepartement
  };

  applyFilters() {
    this.filters = {
      affectation: this.selectedAffectation,
      lastName: this.lastNameFilter,
      firstName: this.firstNameFilter,
      dep: this.selecteddep,
      departement: this.selecteddepartement,
      showAffectation: this.showAffectation,
      showdep: this.showdep,
      showNom: this.showNom,
      showDepartement: this.showdepartement
    };
    this.onFilter.emit(this.filters);
    }
  
  reinitialiser() {
    this.selectedAffectation= 'Tous';
    this.lastNameFilter = '';
    this.firstNameFilter = '';
    this.selecteddep = 'Tous';
    this.selecteddepartement = 'Tous';
    this.applyFilters();
    }

  // initialization
    loadDepartments() {
    this.reportingService.getDistinctDepartments().subscribe((departments) => {
      this.departements = departments;
    });
  }

}
