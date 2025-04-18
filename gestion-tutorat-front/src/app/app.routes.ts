import { Routes } from '@angular/router';
import { EtudiantCreateComponent } from './components/etudiant-create/etudiant-create.component';
import { TuteurCreateComponent } from './components/tuteur-create/tuteur-create.component';
import { ImportComponent } from './components/import/import.component'; // if needed

export const routes: Routes = [
  { path: '', component: ImportComponent },  // default route
  { path: 'etudiant-create', component: EtudiantCreateComponent },
  { path: 'tuteur-create', component: TuteurCreateComponent }
];
