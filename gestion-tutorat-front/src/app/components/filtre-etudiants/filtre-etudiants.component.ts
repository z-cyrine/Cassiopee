import { Component, Input } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtre-etudiants',
  imports: [MatButtonToggleModule, MatExpansionModule, CommonModule, FormsModule],
  templateUrl: './filtre-etudiants.component.html',
  styleUrl: './filtre-etudiants.component.css'
})
export class FiltreEtudiantsComponent {
  @Input() students: any = [];
  
  showAffectation: any = false;
  affectations = ['Tous','Affecté', 'Non affecté'];
  selectedAffectation: any = 'Tous';

  showNom: any = false;
  nameFilter: string = '';   

  showdep: any = false;
  selecteddep: any = 'Tous';  
  deps = [
    "CL_FE-Bachelor3",
    "CL_FE-Bachelor3_PLG",
    "Gp-EM-bach3 APP",
    "Gp-EM-bach3APP",
    "GP-em3 BDI",
    "Gp-em3 MSIF",
    "Gp-em3 ISI",
    "Gp-em3 MD",
    "Gp-em3 MS",
    "Gp-em3 ACSI",    
    "Gp-em3 IB",
    "Gp-em3 IDEE",
    "Gp-em3 MIDE",
    "Gp-em3 SIF",
    "Gp-em3 INT",
    "Gp-em3 DD_REO",
    "Gp-em3-PLG",
    "Gp-EM_FMSc_IB2",
    "Gp-EM_FMSc_MIDE2",
    "MS CMSI_ALT",
    "MS_IAI_ALT",
    "MS DPM_ALT"
  ];
  

  filterVisible=false;
  readonly panelOpenState = signal(false);

  filters = {  // Initialisation de la propriété filters
    students: 'tous', // Choix par défaut pour les étudiants
    teachers: '' // Choix vide par défaut pour les enseignants
  };


  applyFilters() {
      throw new Error('Method not implemented.');
      }

}
