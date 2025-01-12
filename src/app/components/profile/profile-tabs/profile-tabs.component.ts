import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import {
  faUser,
  faPlane,
  faReceipt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

export type ProfileTab = "details" | "trips" | "invoices" | "notifications";

@Component({
  selector: "app-profile-tabs",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div class="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8">
      @for (tab of tabs; track tab.id) {
      <button
        (click)="activeTabChange.emit(tab.id)"
        [class]="
          'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ' +
          (activeTab === tab.id
            ? 'bg-primary-600 text-white shadow-lg scale-[1.02]'
            : 'text-gray-600 hover:bg-gray-50')
        "
      >
        <fa-icon [icon]="tab.icon" class="mx-2"></fa-icon>
        {{ tab.label | translate }}
      </button>
      }
    </div>
  `,
})
export class ProfileTabsComponent {
  @Input() activeTab: ProfileTab = "details";
  @Output() activeTabChange = new EventEmitter<ProfileTab>();

  tabs = [
    { id: "details" as const, label: "profile.tabs.details", icon: faUser },
    { id: "trips" as const, label: "profile.tabs.trips", icon: faPlane },
    {
      id: "invoices" as const,
      label: "profile.tabs.invoices",
      icon: faReceipt,
    },
    {
      id: "notifications" as const,
      label: "profile.tabs.notifications",
      icon: faBell,
    },
  ];
}
