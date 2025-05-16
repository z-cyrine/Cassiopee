import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  // Page d'accueil (par défaut)
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },

  // Routes principales
  { path: 'import', loadComponent: () => import('./components/import/import.component').then(m => m.ImportComponent) },
  { path: 'etudiants/all', loadComponent: () => import('./components/affiche-etudiants/affiche-etudiants.component').then(m => m.AfficheEtudiantsComponent) },
  { path: 'auto-affectation', loadComponent: () => import('./components/auto-affectation/auto-affectation.component').then(m => m.AutoAffectationComponent) },
  { path: 'reporting', loadComponent: () => import('./reporting/reporting.component').then(m => m.ReportingComponent) },
  { path: 'affectation-manuelle', loadComponent: () => import('./components/affectation-manuelle/affectation-manuelle.component').then(m => m.AffectationManuelleComponent) },
  { path: 'tuteurs/all', loadComponent: () => import('./components/affiche-tuteurs/affiche-tuteurs.component').then(m => m.AfficheTuteursComponent) },
  { path: 'majeures/all', loadComponent: () => import('./components/affiche-majeures/affiche-majeures.component').then(m => m.AfficheMajeuresComponent) },
  { path: 'authentification', loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'tuteur-dashboard', loadComponent: () => import('./components/tuteur-dashboard/tuteur-dashboard.component').then(m => m.TuteurDashboardComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },

  // Créations
  { path: 'etudiant-create', loadComponent: () => import('./components/etudiant-create/etudiant-create.component').then(m => m.EtudiantCreateComponent) },
  { path: 'tuteur-create', loadComponent: () => import('./components/tuteur-create/tuteur-create.component').then(m => m.TuteurCreateComponent) },
  { path: 'majeure-create', loadComponent: () => import('./components/majeure-create/majeure-create.component').then(m => m.MajeureCreateComponent) },

  // Détails
  { path: 'etudiants/:id', loadComponent: () => import('./components/etudiant-read/etudiant-read.component').then(m => m.EtudiantReadComponent) },
  { path: 'tuteurs/:id', loadComponent: () => import('./components/tuteur-read/tuteur-read.component').then(m => m.TuteurReadComponent) },
  { path: 'majeures/:id', loadComponent: () => import('./components/majeure-read/majeure-read.component').then(m => m.MajeureReadComponent) },

  // Éditions
  { path: 'etudiants/edit/:id', loadComponent: () => import('./components/etudiant-edit/etudiant-edit.component').then(m => m.EtudiantEditComponent) },
  { path: 'tuteurs/edit/:id', loadComponent: () => import('./components/tuteur-edit/tuteur-edit.component').then(m => m.TuteurEditComponent) },
  { path: 'majeures/edit/:id', loadComponent: () => import('./components/majeure-edit/majeure-edit.component').then(m => m.MajeureEditComponent) },

  // Fallback
  { path: '**', redirectTo: '' }
];
