import { bootstrapApplication } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app/app.routes';  // Import routes
import { AppComponent } from './app/app.component'; // Import your AppComponent
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Routes } from '@angular/router';
import { AfficheEtudiantsComponent } from './app/components/affiche-etudiants/affiche-etudiants.component';
import { ImportComponent } from './app/components/import/import.component';
import { AutoAffectationComponent } from './app/components/auto-affectation/auto-affectation.component';
import { AffectationManuelleComponent } from './app/components/affectation-manuelle/affectation-manuelle.component';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';



registerLocaleData(localeFr, 'fr-FR');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    provideHttpClient(), // sans withInterceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(appRoutes),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 4000,
      closeButton: true,
    })),
    provideAnimationsAsync(),
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ],
}).catch((err) => console.error(err));
