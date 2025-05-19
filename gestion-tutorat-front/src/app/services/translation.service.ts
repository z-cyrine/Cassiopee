import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    // Définir les langues disponibles
    translate.addLangs(['en', 'fr']);
    
    // Définir la langue par défaut
    const browserLang = translate.getBrowserLang();
    translate.setDefaultLang('fr');
    
    // Essayer d'utiliser la langue du navigateur si disponible
    if (browserLang && ['en', 'fr'].includes(browserLang)) {
      translate.use(browserLang);
    }
  }

  // Changer la langue
  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  // Obtenir la langue actuelle
  getCurrentLang(): string {
    return this.translate.currentLang;
  }
} 