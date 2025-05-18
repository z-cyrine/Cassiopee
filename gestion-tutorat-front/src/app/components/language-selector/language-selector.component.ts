import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="language-selector">
      <select (change)="onLanguageChange($event)" [value]="currentLang" class="language-select">
        <option value="fr">Fr</option>
        <option value="en">En</option>
      </select>
    </div>
  `,
  styles: [`
    .language-selector {
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
    .language-select {
      min-width: 50px;
      width: 60px;
      background: transparent;
      color: white;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 3px 8px;
      font-size: 1rem;
      text-align: center;
    }
    .language-select option {
      background-color: #002b45;
      color: white;
    }
  `]
})
export class LanguageSelectorComponent {
  currentLang: string;

  constructor(private translationService: TranslationService) {
    this.currentLang = this.translationService.getCurrentLang();
  }

  onLanguageChange(event: any) {
    const lang = event.target.value;
    this.translationService.switchLanguage(lang);
    this.currentLang = lang;
  }
} 