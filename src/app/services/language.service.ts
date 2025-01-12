import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>("en");
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Initialize language from localStorage or default to 'en'
    const savedLang = localStorage.getItem("language") || "en";
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    localStorage.setItem("language", lang);
    this.translate.use(lang);
    this.currentLangSubject.next(lang);

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

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  isRTL(): boolean {
    return this.getCurrentLang() === "ar";
  }
}
