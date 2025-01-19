import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import {
  faUser,
  faSignInAlt,
  faSignOutAlt,
  faCompass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    TranslateModule,
    LanguageSwitcherComponent,
  ],
  template: `
    <nav class="bg-white/80 backdrop-blur-md shadow-lg z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <img
                src="/assets/logo.png"
                alt="Masar Tours"
                class="h-10 w-auto"
              />
            </a>

            <!-- Desktop Navigation Links -->
            <div
              class="hidden sm:ml-8 sm:flex sm:space-x-4 rtl:space-x-reverse rtl:mr-8"
            >
              <a
                *ngFor="let link of navLinks"
                [routerLink]="link.path"
                routerLinkActive="border-primary-500 text-primary-600"
                [routerLinkActiveOptions]="{ exact: !!link.exact }"
                class="border-transparent text-gray-500 hover:text-primary-500
                        inline-flex items-center px-1 pt-1 border-b-2 text-sm rtl:text-[16px] font-medium
                        transition-all duration-200 hover:scale-105"
              >
                {{ link.label | translate }}
              </a>
            </div>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-2">
            <!-- Language Switcher -->
            <app-language-switcher />

            <!-- Desktop Auth Actions -->
            <div class="hidden sm:flex items-center gap-2">
              @if (authService.isAuthenticated()) {
              <a
                routerLink="/profile"
                class="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <fa-icon [icon]="faUser"></fa-icon>
                <span>{{ "nav.profile" | translate }}</span>
              </a>
              <button
                (click)="logout()"
                class="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <fa-icon
                  [classList]="['rtl:rotate-180']"
                  [icon]="faSignOutAlt"
                ></fa-icon>
                <span>{{ "nav.logout" | translate }}</span>
              </button>
              } @else {
              <a
                routerLink="/auth/login"
                [queryParams]="{ returnUrl: router.url }"
                class="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <fa-icon
                  [classList]="['rtl:rotate-180']"
                  [icon]="faSignInAlt"
                ></fa-icon>
                <span>{{ "nav.login" | translate }}</span>
              </a>
              <a routerLink="/auth/register" class="btn-primary">
                {{ "nav.register" | translate }}
              </a>
              }
            </div>

            <!-- Mobile Menu Button -->
            <button
              class="sm:hidden p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100"
              (click)="isDrawerOpen = !isDrawerOpen"
            >
              <fa-icon
                [icon]="isDrawerOpen ? faTimes : faBars"
                size="lg"
              ></fa-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Drawer -->
      @if (isDrawerOpen) {
      <div class="fixed inset-0 z-50 sm:hidden" (click)="isDrawerOpen = false">
        <!-- Backdrop -->
        <div class="relative inset-0 bg-black/20 backdrop-blur-sm"></div>

        <!-- Drawer Content -->
        <div
          class="relative inset-y-0 rtl:left-0 ltr:right-0 w-64 top-[60px] bg-white shadow-xl"
          (click)="$event.stopPropagation()"
        >
          <div class="p-4 space-y-6">
            <!-- Mobile Navigation Links -->
            <div class="space-y-2">
              @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="text-primary-600 bg-primary-50"
                [routerLinkActiveOptions]="{ exact: !!link.exact }"
                class="block px-4 py-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-50
                            transition-colors rtl:text-[16px]"
                (click)="isDrawerOpen = false"
              >
                {{ link.label | translate }}
              </a>
              }
            </div>

            <hr class="border-gray-200" />

            <!-- Mobile Auth Actions -->
            <div class="space-y-2">
              @if (authService.isAuthenticated()) {
              <a
                routerLink="/profile"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-50"
                (click)="isDrawerOpen = false"
              >
                <fa-icon [icon]="faUser"></fa-icon>
                <span>{{ "nav.profile" | translate }}</span>
              </a>
              <button
                (click)="logout(); isDrawerOpen = false"
                class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-50"
              >
                <fa-icon
                  [classList]="['rtl:rotate-180']"
                  [icon]="faSignOutAlt"
                ></fa-icon>
                <span>{{ "nav.logout" | translate }}</span>
              </button>
              } @else {
              <a
                routerLink="/auth/login"
                [queryParams]="{ returnUrl: router.url }"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-50"
                (click)="isDrawerOpen = false"
              >
                <fa-icon
                  [classList]="['rtl:rotate-180']"
                  [icon]="faSignInAlt"
                ></fa-icon>
                <span>{{ "nav.login" | translate }}</span>
              </a>
              <a
                routerLink="/auth/register"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                (click)="isDrawerOpen = false"
              >
                {{ "nav.register" | translate }}
              </a>
              }
            </div>
          </div>
        </div>
      </div>
      }
    </nav>
    <div class="h-16"></div>
  `,
})
export class NavbarComponent {
  isDrawerOpen = false;

  // Icons
  faUser = faUser;
  faSignInAlt = faSignInAlt;
  faSignOutAlt = faSignOutAlt;
  faCompass = faCompass;
  faBars = faBars;
  faTimes = faTimes;

  navLinks = [
    { path: "/", label: "nav.home", exact: true },
    { path: "/gallery", label: "nav.gallery", exact: false },
    { path: "/trips", label: "nav.trips", exact: false },
    // { path: "/reviews", label: "nav.reviews", exact: false },
  ];
  protected authService = inject(AuthService);
  protected router = inject(Router);

  logout() {
    this.authService.logout();
    this.isDrawerOpen = false;
  }
}
