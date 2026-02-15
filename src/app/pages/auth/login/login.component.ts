import { Component, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSignInAlt,
  faEnvelope,
  faLock,
  faPhone,
  faMobile,
  faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { DialogService } from '../../../services/dialog.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment.development';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, FaIconComponent, TranslatePipe, NgClass],
  template: `
    <div class="min-h-screen relative bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080"
          alt="Login Background"
          class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <!-- Login Form Container -->
      <div class="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <!-- Logo or Brand -->
          <img src="/assets/logo.png" alt="Masar Logo" class="mx-auto h-16 w-auto" />
          <h2 class="mt-6 text-center text-4xl font-extrabold text-white">
            {{ 'auth.login.title' | translate }}
          </h2>
          <p class="mt-2 text-center text-lg text-white/80">
            {{ 'auth.login.subtitle' | translate }}
          </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="glass-container p-8">
            @if (error) {
              <div
                class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative"
                role="alert">
                <span class="block sm:inline">{{ error }}</span>
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- phone Field -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">
                  <fa-icon [icon]="faMobile" class="ml-2 rtl:mr-2"></fa-icon>
                  {{ 'auth.phone' | translate }}
                </label>
                <div class="mt-1">
                  <input
                    id="phone"
                    type="tel"
                    placeholder="1234567890"
                    formControlName="phone"
                    class="input-field text-end"
                    placeholder="01023456789"
                    required />
                  <span class="text-gray-500 text-xs">{{ 'auth.phone_hint' | translate }}</span>
                  @if (
                    loginForm.get('phone')?.errors?.['required'] && loginForm.get('phone')?.touched
                  ) {
                    <p class="mt-1 text-sm text-red-600">
                      {{ 'auth.form.phoneRequired' | translate }}
                    </p>
                  }
                  @if (loginForm.get('phone')?.errors?.['pattern']) {
                    <p class="mt-1 text-sm text-red-600">
                      {{ 'auth.form.phoneInvalid' | translate }}
                    </p>
                  }
                </div>
              </div>

              <!-- Password Field -->
              <!-- <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  <fa-icon [icon]="faLock" class="mx-2"></fa-icon>
                  Password
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
                  @if (loginForm.get('password')?.errors?.['required'] &&
                  loginForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Password is required</p>
                  }
                </div>
              </div> -->

              <!-- Remember Me & Forgot Password -->
              <!-- <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    formControlName="rememberMe"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    for="remember_me"
                    class="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div> -->

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="!loginForm.valid || isLoading"
                  class="w-full btn-primary flex justify-center items-center disabled:opacity-50"
                  [ngClass]="{
                    'pointer-events-none': loginForm.invalid || isLoading,
                  }">
                  <fa-icon [icon]="faSignInAlt" class="mx-2 rtl:rotate-180"></fa-icon>
                  {{
                    isLoading
                      ? ('auth.login.loading' | translate)
                      : ('auth.login.button' | translate)
                  }}
                </button>
              </div>
            </form>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-6">
              <div class="flex-1 border-t border-gray-300"></div>
              <span class="text-sm text-gray-500">أو</span>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <!-- Google Sign-In Button -->
            <button
              type="button"
              (click)="loginWithGoogle()"
              class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="font-medium text-gray-700">تسجيل الدخول باستخدام Google</span>
            </button>

            <!-- Register Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                {{ 'auth.register.noAccount' | translate }}
                <a
                  routerLink="/auth/register"
                  class="font-medium text-primary-600 hover:text-primary-500 hover:underline">
                  {{ 'auth.register.createAccount' | translate }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  faSignInAlt = faSignInAlt;
  faMobile = faMobileAlt;
  faLock = faLock;
  dialogService = inject(DialogService);
  translateService = inject(TranslateService);
  reservationService = inject(ReservationService);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^0(10|11|12|15)[0-9]{8}$')]],
      // password: ["", [Validators.required, Validators.minLength(6)]],
      // rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const { phone } = this.loginForm.value;
      // phone number act as email and password until now

      this.authService
        .login({
          phoneNumber: phone,
          password: environment.userPassword,
        })
        .subscribe((success: boolean) => {
          this.isLoading = false;
          if (success) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            if (returnUrl.includes('login')) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate([returnUrl]);
            }
          }
        });
    }
  }

  loginWithGoogle() {
    // Store return URL if exists
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }

    // Redirect to backend Google OAuth endpoint
    window.location.href = `${environment.apiUrl}/auth/google`;
  }
}
