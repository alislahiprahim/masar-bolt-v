import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../../models/user.model";
import { AuthService } from "../../../services/auth.service";
import { UserDetails } from "../../../models/auth.model";

@Component({
  selector: "app-profile-details",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule,
  ],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <form
        [formGroup]="profileForm"
        (ngSubmit)="onSubmit.emit(profileForm.value)"
        class="space-y-6"
      >
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
              {{ "profile.details.name" | translate }}
            </label>
            <input
              type="text"
              formControlName="name"
              class="input-field mt-1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faEnvelope" class="mr-2"></fa-icon>
              {{ "profile.details.email" | translate }}
            </label>
            <input
              type="email"
              formControlName="email"
              class="input-field mt-1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faPhone" class="mr-2"></fa-icon>
              {{ "profile.details.phone" | translate }}
            </label>
            <input
              type="tel"
              formControlName="phone"
              class="input-field mt-1"
            />
          </div>
        </div>

        <!-- <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ "profile.details.preferences.title" | translate }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700">{{
                "profile.details.preferences.destinations" | translate
              }}</label>
              <select
                multiple
                formControlName="preferredDestinations"
                class="input-field mt-1"
              >
                <option value="beach">Beach destinations</option>
                <option value="mountain">Mountain destinations</option>
                <option value="city">City breaks</option>
                <option value="cultural">Cultural experiences</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-700">{{
                "profile.details.preferences.travelStyle" | translate
              }}</label>
              <select formControlName="travelStyle" class="input-field mt-1">
                <option value="luxury">Luxury</option>
                <option value="adventure">Adventure</option>
                <option value="budget">Budget-friendly</option>
                <option value="family">Family-oriented</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-700">{{
                "profile.details.preferences.dietary" | translate
              }}</label>
              <input
                type="text"
                formControlName="dietaryRestrictions"
                class="input-field mt-1"
                placeholder="e.g., vegetarian, gluten-free"
              />
            </div>
          </div>
        </div> -->

        <div class="flex justify-end space-x-4 rtl:space-x-reverse">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {{ "profile.details.buttons.cancel" | translate }}
          </button>
          <button type="submit" class="btn-primary">
            {{ "profile.details.buttons.save" | translate }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProfileDetailsComponent {
  @Input() profileForm!: FormGroup;
  @Output() onSubmit = new EventEmitter<void>();

  user: UserDetails | null = null;
  // Icons
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.email]],
      phone: [
        "",
        [Validators.required, Validators.pattern("^0(10|11|12|15)[0-9]{8}$")],
      ],
      // preferredDestinations: [[]],
      // travelStyle: [""],
      // dietaryRestrictions: [""],
    });
  }
  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phoneNumber,
        preferredDestinations: this.user.preferences?.preferredDestinations,
        travelStyle: this.user.preferences?.travelStyle,
        dietaryRestrictions:
          this.user.preferences?.dietaryRestrictions?.join(", "),
      });
    }
  }
}
