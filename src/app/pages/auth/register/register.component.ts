import { Component } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faUserPlus,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../../services/auth.service";
import { removeEmptyFields } from "../../../utils/helper";
@Component({
  selector: "app-register",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule,
    NgClass,
  ],
  template: `
    <div
      class="min-h-screen relative bg-gradient-to-br from-primary-50 to-secondary-50"
    >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
          alt="Register Background"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <!-- Register Form Container -->
      <div
        class="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      >
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <!-- Logo or Brand -->
          <img
            src="/assets/logo.png"
            alt="Masar Logo"
            class="mx-auto h-16 w-auto"
          />
          <h2 class="mt-6 text-center text-4xl font-extrabold text-white">
            {{ "auth.register.joinCommunity" | translate }}
          </h2>
          <p class="mt-2 text-center text-lg text-white/80">
            {{ "auth.register.startJourney" | translate }}
          </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="glass-container p-8">
            <form
              [formGroup]="registerForm"
              (ngSubmit)="onSubmit()"
              class="space-y-6"
              novalidate
            >
              <!-- Name Fields -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
                    {{ "auth.register.firstName" | translate }} *
                  </label>
                  <div class="mt-1">
                    <input
                      id="firstName"
                      type="text"
                      formControlName="firstName"
                      class="input-field"
                      placeholder="أحمد"
                      required
                    />
                    @if (registerForm.get('firstName')?.errors?.['required'] &&
                    registerForm.get('firstName')?.touched) {
                    <p class="mt-1 text-sm text-red-600">
                      {{ "auth.register.firstNameRequired" | translate }}
                    </p>
                    }
                  </div>
                </div>

                <div>
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
                    {{ "auth.register.lastName" | translate }} *
                  </label>
                  <div class="mt-1">
                    <input
                      id="lastName"
                      type="text"
                      formControlName="lastName"
                      class="input-field"
                      placeholder="محمد"
                      required
                    />
                    @if (registerForm.get('lastName')?.errors?.['required'] &&
                    registerForm.get('lastName')?.touched) {
                    <p class="mt-1 text-sm text-red-600">
                      {{ "auth.register.lastNameRequired" | translate }}
                    </p>
                    }
                  </div>
                </div>
              </div>

              <!-- Email Field -->
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  <fa-icon [icon]="faEnvelope" class="mr-2"></fa-icon>
                  {{ "auth.register.emailAddress" | translate }}
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    class="input-field"
                    placeholder="البريد@الإلكتروني.com"
                  />
                  @if (registerForm.get('email')?.errors?.['email'] &&
                  registerForm.get('email')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    {{ "auth.register.validEmail" | translate }}
                  </p>
                  }
                </div>
              </div>

              <!-- Phone Number Field  -->
              <div>
                <label
                  for="phoneNumber"
                  class="block text-sm font-medium text-gray-700"
                >
                  <fa-icon [icon]="faPhone" class="mr-2"></fa-icon>
                  {{ "auth.register.phoneNumber" | translate }} *
                </label>
                <div class="mt-1">
                  <input
                    id="phoneNumber"
                    type="tel"
                    formControlName="phoneNumber"
                    class="input-field"
                    placeholder="01012345678"
                    required
                  />
                  @if (registerForm.get('phoneNumber')?.errors?.['required'] &&
                  registerForm.get('phoneNumber')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    {{ "auth.register.phoneNumberRequired" | translate }}
                  </p>
                  }
                </div>
              </div>
              <!-- Password Fields -->
              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  <fa-icon [icon]="faLock" class="mr-2"></fa-icon>
                  {{ "auth.login.password" | translate }} *
                </label>
                <div class="mt-1">
                  <input
                    id="password"
                    type="password"
                    formControlName="password"
                    class="input-field"
                    placeholder="••••••••"
                    required
                  />
                  @if (registerForm.get('password')?.errors?.['required'] &&
                  registerForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    {{ "auth.register.passwordRequired" | translate }}
                  </p>
                  } @if (registerForm.get('password')?.errors?.['minlength'] &&
                  registerForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    {{ "auth.register.passwordMinLength" | translate }}
                  </p>
                  }
                </div>
              </div>

              <div>
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700"
                >
                  <fa-icon [icon]="faLock" class="mr-2"></fa-icon>
                  {{ "auth.register.confirmPassword" | translate }} *
                </label>
                <div class="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    formControlName="confirmPassword"
                    class="input-field"
                    placeholder="••••••••"
                    required
                  />
                  @if (registerForm.errors?.['mismatch'] &&
                  registerForm.get('confirmPassword')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    {{ "auth.register.passwordMismatch" | translate }}
                  </p>
                  }
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="!registerForm.valid || isLoading"
                  class="w-full btn-primary flex justify-center items-center disabled:opacity-50 "
                  [ngClass]="{
                    'pointer-events-none': registerForm.invalid || isLoading
                  }"
                >
                  <fa-icon [icon]="faUserPlus" class="mx-2"></fa-icon>
                  {{ "auth.register.createAccount" | translate }}
                </button>
              </div>
            </form>

            <!-- Login Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                {{ "auth.register.alreadyHaveAccount" | translate }}
                <a
                  routerLink="/auth/login"
                  class="font-medium text-primary-600 hover:text-primary-500 hover:underline"
                >
                  {{ "auth.register.signInHere" | translate }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUserPlus = faUserPlus;
  faPhone = faPhone;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        phoneNumber: [
          "",
          [Validators.required, Validators.pattern("^0(10|11|12|15)[0-9]{8}$")],
        ],
        email: ["", Validators.email],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        roleIds: [["1"]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirmPassword")?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...rest } = this.registerForm.value;
      this.isLoading = true;
      this.authService.register(removeEmptyFields(rest)).subscribe((res) => {
        this.isLoading = false;
        if (res) {
          // this.dialogService.success("Profile updated successfully!");
          const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
          this.router.navigate([returnUrl]);
        }
      });
    }
  }
}