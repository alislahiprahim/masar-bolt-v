import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { LanguageService } from "./language.service";
import { isPlatformBrowser } from "@angular/common";

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

@Injectable({
  providedIn: "root",
})
export class SeoService {
  private readonly baseUrl = "https://masar-travel.com"; // Replace with your actual domain
  private readonly defaultImage = "/assets/masar-og-image.jpg";
  platformId = inject(PLATFORM_ID);
  constructor(
    private meta: Meta,
    private title: Title,
    private languageService: LanguageService
  ) {}

  updateSeo(config: SeoConfig) {
     if (!isPlatformBrowser(this.platformId)) return;
    const isRTL = this.languageService.isRTL();
    const lang = this.languageService.getCurrentLang();

    // Update basic meta tags
    this.title.setTitle(`${config.title} | Masar Travel`);
    this.meta.updateTag({ name: "description", content: config.description });

    if (config.keywords) {
      this.meta.updateTag({
        name: "keywords",
        content: config.keywords.join(", "),
      });
    }

    // Language and direction meta tags
    this.meta.updateTag({ httpEquiv: "content-language", content: lang });
    this.meta.updateTag({ name: "language", content: lang });

    // Open Graph tags
    this.meta.updateTag({
      property: "og:title",
      content: `${config.title} | Masar Travel`,
    });
    this.meta.updateTag({
      property: "og:description",
      content: config.description,
    });
    this.meta.updateTag({
      property: "og:type",
      content: config.ogType || "website",
    });
    this.meta.updateTag({
      property: "og:image",
      content: this.baseUrl + (config.ogImage || this.defaultImage),
    });
    this.meta.updateTag({ property: "og:url", content: window.location.href });
    this.meta.updateTag({ property: "og:site_name", content: "Masar Travel" });
    this.meta.updateTag({ property: "og:locale", content: lang });

    // Twitter Card tags
    this.meta.updateTag({
      name: "twitter:card",
      content: config.twitterCard || "summary_large_image",
    });
    this.meta.updateTag({ name: "twitter:site", content: "@MasarTravel" });
    this.meta.updateTag({
      name: "twitter:title",
      content: `${config.title} | Masar Travel`,
    });
    this.meta.updateTag({
      name: "twitter:description",
      content: config.description,
    });
    this.meta.updateTag({
      name: "twitter:image",
      content: this.baseUrl + (config.ogImage || this.defaultImage),
    });

    // Additional SEO meta tags
    this.meta.updateTag({ name: "robots", content: "index, follow" });
    this.meta.updateTag({ name: "author", content: "Masar Travel" });
    this.meta.updateTag({
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    });
  }

  setCanonicalUrl(url?: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    let link: HTMLLinkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", url || window.location.href);

    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(link);
    }
  }
}
