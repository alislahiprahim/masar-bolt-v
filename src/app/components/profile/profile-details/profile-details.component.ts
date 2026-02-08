import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TelegramConnectionComponent } from '../../telegram/telegram-connection/telegram-connection.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserDetails } from '../../../models/auth.model';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, TranslateModule, TelegramConnectionComponent],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <form
        [formGroup]="profileForm"
        (ngSubmit)="onSubmit.emit(profileForm.value)"
        class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
              {{ 'profile.details.name' | translate }}
            </label>
            <input type="text" formControlName="firstName" class="input-field mt-1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
              {{ 'profile.details.lastName' | translate }}
            </label>
            <input type="text" formControlName="lastName" class="input-field mt-1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faPhone" class="mr-2"></fa-icon>
              {{ 'profile.details.phone' | translate }}
            </label>
            <input
              type="tel"
              formControlName="phoneNumber"
              class="input-field mt-1"
              placeholder="e.g., +1234567890" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faEnvelope" class="mr-2"></fa-icon>
              {{ 'profile.details.email' | translate }}
            </label>
            <input type="email" formControlName="email" class="input-field mt-1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
              {{ 'profile.details.profilePicture' | translate }}
            </label>
            <input
              type="file"
              formControlName="profilePicture"
              class="input-field mt-1"
              accept="image/*" />
          </div>
        </div>

        <div class="flex justify-end space-x-4 rtl:space-x-reverse">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            {{ 'profile.details.buttons.cancel' | translate }}
          </button>
          <button type="submit" class="btn-primary">
            {{ 'profile.details.buttons.save' | translate }}
          </button>
        </div>
      </form>
    </div>
    
    <app-telegram-connection />
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: { value: '', disabled: true },
      profilePicture: [''],
    });
  }
  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        profilePicture: this.user.profilePicture,
      });
    }
  }
}
