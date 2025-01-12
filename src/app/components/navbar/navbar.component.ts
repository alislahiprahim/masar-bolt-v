import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faSignInAlt, faSignOutAlt, faCompass } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";

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
    <nav class="fixed w-full z-50 backdrop-blur-md bg-white/80 shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2 ">
              <img
                src="/assets/logo.png"
                alt="Masar Tours"
                class="h-10 w-auto"
              />
              <!-- <span class="text-2xl font-bold text-primary-500 font-poppins">Masar</span> -->
            </a>

            <!-- Navigation Links -->
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
          <div class="flex items-center gap-2 space-x-6">
            <!-- Language Switcher -->
            <app-language-switcher />

            @if (authService.isAuthenticated()) {
            <!-- User Menu -->
            <div class="relative">
              <a
                routerLink="/profile"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <fa-icon [icon]="faUser"></fa-icon>
                <span>{{ "nav.profile" | translate }}</span>
              </a>
            </div>
            <!-- Logout Button -->
            <button
              (click)="authService.logout()"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <fa-icon
                [classList]="['rtl:rotate-180']"
                [icon]="faSignOutAlt"
              ></fa-icon>
              <span>{{ "nav.logout" | translate }}</span>
            </button>
            } @else {
            <!-- Login/Register Buttons -->
            <a
              routerLink="/auth/login"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors rtl:gap-2"
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
        </div>
      </div>
    </nav>
    <div class="h-16"></div>
  `,
})
export class NavbarComponent {
  faUser = faUser;
  faSignInAlt = faSignInAlt;
  faSignOutAlt = faSignOutAlt;
  faCompass = faCompass;

  navLinks = [
    { path: "/", label: "nav.home", exact: true },
    { path: "/gallery", label: "nav.gallery", exact: false },
    { path: "/trips", label: "nav.trips", exact: false },
    { path: "/reviews", label: "nav.reviews", exact: false },
  ];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}