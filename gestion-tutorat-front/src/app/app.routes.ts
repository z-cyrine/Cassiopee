import { Routes } from '@angular/router';
import { RoleGuard } from './services/gestion-acces/guards/role.guard';
import { AuthGuard } from './services/gestion-acces/guards/auth.guard';

export const appRoutes: Routes = [
  // Page d'accueil (par défaut)
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },

  // Routes principales
  { path: 'import', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/import/import.component').then(m => m.ImportComponent) },
  { path: 'etudiants/all', canActivate: [RoleGuard(['admin', 'consultation'])], loadComponent: () => import('./components/affiche-etudiants/affiche-etudiants.component').then(m => m.AfficheEtudiantsComponent) },
  { path: 'auto-affectation',  canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/auto-affectation/auto-affectation.component').then(m => m.AutoAffectationComponent) },
  { path: 'reporting', canActivate: [RoleGuard(['admin', 'consultation'])], loadComponent: () => import('./reporting/reporting.component').then(m => m.ReportingComponent) },
  { path: 'affectation-manuelle',  canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/affectation-manuelle/affectation-manuelle.component').then(m => m.AffectationManuelleComponent) },
  { path: 'tuteur-dashboard', loadComponent: () => import('./components/tuteur-dashboard/tuteur-dashboard.component').then(m => m.TuteurDashboardComponent) },
  { path: 'tuteurs/all', canActivate: [RoleGuard(['admin', 'consultation'])], loadComponent: () => import('./components/affiche-tuteurs/affiche-tuteurs.component').then(m => m.AfficheTuteursComponent) },
  { path: 'majeures/all', canActivate: [RoleGuard(['admin', 'consultation'])],loadComponent: () => import('./components/affiche-majeures/affiche-majeures.component').then(m => m.AfficheMajeuresComponent) },
  // { path: 'authentification', loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent) },

  //Authentification
  // { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'cas/callback', loadComponent: () => import('./components/cas-callback/cas-callback.component').then(m => m.CasCallbackComponent) },

  // Utilisateurs
  { path: 'utilisateurs/all', canActivate: [RoleGuard(['admin'])],loadComponent: () => import('./components/affiche-utilisateurs/affiche-utilisateurs.component').then(m => m.AfficheUtilisateursComponent) },
  { path: 'utilisateurs/create', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/user-create/user-create.component').then(m => m.UserCreateComponent) },
  { path: 'profil', canActivate: [AuthGuard], loadComponent: () => import('./components/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'utilisateurs/edit/:id', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/user-edit/user-edit.component').then(m => m.UserEditComponent) },

  // Créations
  { path: 'etudiant-create', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/etudiant-create/etudiant-create.component').then(m => m.EtudiantCreateComponent) },
  { path: 'tuteur-create', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/tuteur-create/tuteur-create.component').then(m => m.TuteurCreateComponent) },
  { path: 'majeure-create', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/majeure-create/majeure-create.component').then(m => m.MajeureCreateComponent) },

  // Détails
  { path: 'etudiants/:id', canActivate: [AuthGuard], loadComponent: () => import('./components/etudiant-read/etudiant-read.component').then(m => m.EtudiantReadComponent) },
  { path: 'tuteurs/:id', canActivate: [RoleGuard(['admin', 'consultation'])], loadComponent: () => import('./components/tuteur-read/tuteur-read.component').then(m => m.TuteurReadComponent) },
  { path: 'majeures/:id', canActivate: [RoleGuard(['admin', 'consultation'])], loadComponent: () => import('./components/majeure-read/majeure-read.component').then(m => m.MajeureReadComponent) },

  // Éditions
  { path: 'etudiants/edit/:id',  canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/etudiant-edit/etudiant-edit.component').then(m => m.EtudiantEditComponent) },
  { path: 'tuteurs/edit/:id',  canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/tuteur-edit/tuteur-edit.component').then(m => m.TuteurEditComponent) },
  { path: 'majeures/edit/:id', canActivate: [RoleGuard(['admin'])], loadComponent: () => import('./components/majeure-edit/majeure-edit.component').then(m => m.MajeureEditComponent) },

  // Tuteur et étudiants
  { path: 'tuteur/:id/etudiants', canActivate: [AuthGuard],loadComponent: () => import('./components/tuteur-etudiants/tuteur-etudiants.component').then(m => m.TuteurEtudiantsComponent) },

  // Fallback
  { path: '**', redirectTo: '' }
];
