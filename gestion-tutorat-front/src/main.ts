import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Routes } from '@angular/router';
import { AfficheEtudiantsComponent } from './app/components/affiche-etudiants/affiche-etudiants.component';
import { ImportComponent } from './app/components/import/import.component';
import { AutoAffectationComponent } from './app/components/auto-affectation/auto-affectation.component';
import { AffectationManuelleComponent } from './app/components/affectation-manuelle/affectation-manuelle.component';

const routes: Routes = [
  { path: '', redirectTo: 'etudiants/all', pathMatch: 'full' },
  { path: 'etudiants/all', component: AfficheEtudiantsComponent },
  { path: 'import', component: ImportComponent },    
  { path: 'auto-affectation', component: AutoAffectationComponent },
  { path: 'affectation-manuelle', component: AffectationManuelleComponent },
  { path: '**', redirectTo: 'etudiants/all' },

];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideAnimationsAsync()
  ],
}).catch((err) => console.error(err));
