import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent {
  currentLang: string;

  constructor(private translationService: TranslationService) {
    this.currentLang = this.translationService.getCurrentLang();
  }

  switchLanguage(lang: string): void {
    this.translationService.switchLanguage(lang);
    this.currentLang = lang;
  }
}
