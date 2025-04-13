import { Routes } from '@angular/router';
import { EtudiantCreateComponent } from './components/etudiant-create/etudiant-create.component';
import { TuteurCreateComponent } from './components/tuteur-create/tuteur-create.component';
import { AfficheEtudiantsComponent } from './components/affiche-etudiants/affiche-etudiants.component';
import { ImportComponent } from './components/import/import.component';
import { AutoAffectationComponent } from './components/auto-affectation/auto-affectation.component';
import { ReportingComponent } from './reporting/reporting.component';
import { EtudiantReadComponent } from './components/etudiant-read/etudiant-read.component';
import { TuteurReadComponent } from './components/tuteur-read/tuteur-read.component';
import { EtudiantEditComponent } from './components/etudiant-edit/etudiant-edit.component';
import { TuteurEditComponent } from './components/tuteur-edit/tuteur-edit.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/etudiants/all', pathMatch: 'full' },
  { path: 'etudiants/all', component: AfficheEtudiantsComponent },
  { path: 'import', component: ImportComponent },
  { path: 'auto-affectation', component: AutoAffectationComponent },
  { path: 'etudiant-create', component: EtudiantCreateComponent },
  { path: 'tuteur-create', component: TuteurCreateComponent },
  { path: 'reporting', component: ReportingComponent },
  { path: 'etudiants/:id', component: EtudiantReadComponent },
  { path: 'tuteurs/:id', component: TuteurReadComponent },
  { path: 'etudiants/edit/:id', component: EtudiantEditComponent },
  { path: 'tuteurs/edit/:id', component: TuteurEditComponent },
  { path: '**', redirectTo: '/etudiants/all' }  // Catch-all route
];
