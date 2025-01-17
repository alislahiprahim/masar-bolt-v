import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-profile-header",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  template: `
    <div
      class="relative bg-gradient-to-r from-primary-600 to-primary-800 py-16"
    >
      <div class="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080"
          alt="Profile Background"
          class="w-full h-full object-cover opacity-10"
        />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-8 gap-2">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-white"
            >
              <img
                [src]="
                  user?.profilePicture ||
                  'https://ui-avatars.com/api/?name=' +
                    user?.firstName +
                    '+' +
                    user?.lastName
                "
                [alt]="user?.firstName"
                class="w-full h-full object-cover"
              />
            </div>
            <button
              class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <fa-icon
                [icon]="faPencilAlt"
                class="text-primary-600 text-sm"
              ></fa-icon>
            </button>
          </div>

          <div>
            <h1 class="text-3xl font-bold text-white">
              {{ "profile.welcome" | translate : { name: user?.firstName } }}
            </h1>
            <p class="text-primary-100 mt-1">
              {{ "profile.subtitle" | translate }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileHeaderComponent {
  @Input() user: User | null = null;
  faPencilAlt = faPencilAlt;
}
