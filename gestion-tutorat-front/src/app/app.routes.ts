import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/etudiants/all', pathMatch: 'full' },
  { path: 'etudiants/all', loadComponent: () => import('./components/affiche-etudiants/affiche-etudiants.component').then(m => m.AfficheEtudiantsComponent) },
  { path: 'import', loadComponent: () => import('./components/import/import.component').then(m => m.ImportComponent) },
  { path: 'auto-affectation', loadComponent: () => import('./components/auto-affectation/auto-affectation.component').then(m => m.AutoAffectationComponent) },
  { path: 'etudiant-create', loadComponent: () => import('./components/etudiant-create/etudiant-create.component').then(m => m.EtudiantCreateComponent) },
  { path: 'tuteur-create', loadComponent: () => import('./components/tuteur-create/tuteur-create.component').then(m => m.TuteurCreateComponent) },
  { path: 'majeure-create', loadComponent: () => import('./components/majeure-create/majeure-create.component').then(m => m.MajeureCreateComponent) },
  { path: 'reporting', loadComponent: () => import('./reporting/reporting.component').then(m => m.ReportingComponent) },
  { path: 'etudiants/:id', loadComponent: () => import('./components/etudiant-read/etudiant-read.component').then(m => m.EtudiantReadComponent) },
  { path: 'tuteurs/:id', loadComponent: () => import('./components/tuteur-read/tuteur-read.component').then(m => m.TuteurReadComponent) },
  { path: 'etudiants/edit/:id', loadComponent: () => import('./components/etudiant-edit/etudiant-edit.component').then(m => m.EtudiantEditComponent) },
  { path: 'tuteurs/edit/:id', loadComponent: () => import('./components/tuteur-edit/tuteur-edit.component').then(m => m.TuteurEditComponent) },
  { path: 'majeures/:id', loadComponent: () => import('./components/majeure-read/majeure-read.component').then(m => m.MajeureReadComponent) },
  { path: 'majeures/edit/:id', loadComponent: () => import('./components/majeure-edit/majeure-edit.component').then(m => m.MajeureEditComponent) },
  { path: '**', redirectTo: '/etudiants/all' }
];
