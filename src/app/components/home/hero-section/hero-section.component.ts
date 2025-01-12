import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-hero-section",
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, TranslateModule],
  template: `
    <div class="relative min-h-screen flex items-center">
      <!-- Video Background -->
      <div class="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-cover"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-villas-by-the-beach-1963/720p.mp4"
            type="video/mp4"
          />
        </video>
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
        ></div>
      </div>

      <!-- Hero Content -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div class="text-center">
          <h1
            class="text-5xl md:text-6xl font-extrabold text-white mb-6 animate-float"
          >
            {{ "home.hero.title" | translate }}
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {{ "home.hero.subtitle" | translate }}
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="glass p-2 rounded-full flex items-center shadow-lg">
              <div class="flex-1 px-4">
                <input
                  type="text"
                  [placeholder]="'home.hero.searchPlaceholder' | translate"
                  class="w-full bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-300"
                />
              </div>
              <button
                class="btn-primary rounded-full px-6 py-2 flex items-center space-x-2 rtl:gap-2"
              >
                <fa-icon [icon]="faSearch"></fa-icon>
                <span>{{ "common.search" | translate }}</span>
              </button>
            </div>
          </div>

          <a
            routerLink="/trips"
            class="inline-flex items-center btn-primary text-lg px-8 py-3 rounded-full
                    transform hover:scale-105 transition-all duration-300"
          >
            {{ "home.hero.discoverButton" | translate }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class HeroSectionComponent {
  faSearch = faSearch;
}
