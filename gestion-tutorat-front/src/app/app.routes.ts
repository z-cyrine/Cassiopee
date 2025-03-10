import { Routes } from '@angular/router';
import { EditEtudiantComponent } from './components/etudiant/edit-etudiant/edit-etudiant.component';
import { EditTuteurComponent } from './components/tuteur/edit-tuteur/edit-tuteur.component';
import { ImportComponent } from './components/import/import.component';

export const routes: Routes = [
    { path: 'etudiant/edit/:id', component: EditEtudiantComponent },
    { path: 'tuteur/edit/:id', component: EditTuteurComponent },
    { path: 'import', component: ImportComponent },
];
