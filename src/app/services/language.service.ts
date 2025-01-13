import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>("en");
  currentLang$ = this.currentLangSubject.asObservable();
  platformId = inject(PLATFORM_ID);
  constructor(private translate: TranslateService) {
    // Initialize language from localStorage or default to 'en'
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem("language") || "en";
      this.setLanguage(savedLang);
    }
  }

  setLanguage(lang: string) {
    if (isPlatformBrowser(this.platformId))
      localStorage.setItem("language", lang);
    this.translate.use(lang);
    this.currentLangSubject.next(lang);

    if (isPlatformBrowser(this.platformId)) {
      // Set HTML dir attribute for RTL support
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;

      // Add RTL class to body for Tailwind RTL support
      if (lang === "ar") {
        document.body.classList.add("rtl");
      } else {
        document.body.classList.remove("rtl");
      }
    }
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  isRTL(): boolean {
    return this.getCurrentLang() === "ar";
  }
}
