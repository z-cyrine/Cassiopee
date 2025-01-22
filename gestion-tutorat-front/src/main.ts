import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Routes } from '@angular/router';
import { AfficheEtudiantsComponent } from './app/affiche-etudiants/affiche-etudiants.component';
import { ImportComponent } from './app/components/import/import.component';

const routes: Routes = [
  { path: '', component: AppComponent }, 
  { path: 'etudiants/all', component: AfficheEtudiantsComponent },
  { path: 'importer', component: ImportComponent },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
