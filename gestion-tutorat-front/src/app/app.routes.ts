import { Routes } from '@angular/router';
import { EtudiantCreateComponent } from './components/etudiant-create/etudiant-create.component';
import { TuteurCreateComponent } from './components/tuteur-create/tuteur-create.component';
import { AfficheEtudiantsComponent } from './components/affiche-etudiants/affiche-etudiants.component';
import { ImportComponent } from './components/import/import.component';
import { AutoAffectationComponent } from './components/auto-affectation/auto-affectation.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/etudiants/all', pathMatch: 'full' },
  { path: 'etudiants/all', component: AfficheEtudiantsComponent },
  { path: 'import', component: ImportComponent },
  { path: 'auto-affectation', component: AutoAffectationComponent },
  { path: 'etudiant-create', component: EtudiantCreateComponent },
  { path: 'tuteur-create', component: TuteurCreateComponent },
  { path: '**', redirectTo: '/etudiants/all' },  // Catch-all route
];
