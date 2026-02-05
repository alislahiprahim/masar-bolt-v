import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  template: `
    <div class="relative">
      <select
        [value]="languageService.getCurrentLang()"
        (change)="switchLanguage($event)"
        class="appearance-none bg-transparent border border-gray-300 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  `,
})
export class LanguageSwitcherComponent {
  constructor(public languageService: LanguageService) {}

  switchLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value);
  }
}
