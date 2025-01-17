import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import {
  faUser,
  faPlane,
  faReceipt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-profile-tabs",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    TranslateModule,
  ],
  template: `
    <!-- Mobile Tabs -->
    <div class="block sm:hidden overflow-x-auto scrollbar-hide">
      <div class="flex space-x-2 p-1 min-w-full bg-white rounded-xl shadow-sm">
        @for (tab of tabs; track tab.path) {
        <a
          [routerLink]="tab.path"
          routerLinkActive="bg-primary-600 text-white shadow-lg scale-[1.02]"
          class="flex-none flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-600 "
        >
          <fa-icon [icon]="tab.icon" class="text-lg"></fa-icon>
          <span class="mx-2 whitespace-nowrap">{{
            tab.label | translate
          }}</span>
        </a>
        }
      </div>
    </div>

    <!-- Desktop Tabs -->
    <div class="hidden sm:flex space-x-1 bg-white p-1 rounded-xl shadow-sm">
      @for (tab of tabs; track tab.path) {
      <a
        [routerLink]="tab.path"
        routerLinkActive="bg-primary-600 text-white shadow-lg scale-[1.02]"
        class="flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 "
      >
        <fa-icon [icon]="tab.icon" class="mx-2"></fa-icon>
        {{ tab.label | translate }}
      </a>
      }
    </div>
  `,
  styles: [
    `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `,
  ],
})
export class ProfileTabsComponent {
  tabs = [
    { path: "./details", label: "profile.tabs.details", icon: faUser },
    { path: "./trips", label: "profile.tabs.trips", icon: faPlane },
    {
      path: "./reservations",
      label: "reservations.title",
      icon: faPlane,
    },
    { path: "./invoices", label: "profile.tabs.invoices", icon: faReceipt },
    {
      path: "./notifications",
      label: "profile.tabs.notifications",
      icon: faBell,
    },
  ];
}
