import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="min-h-screen relative bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
             alt="Register Background"
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <!-- Register Form Container -->
      <div class="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <!-- Logo or Brand -->
          <img src="/assets/logo.png" alt="Masar Logo" class="mx-auto h-16 w-auto">
          <h2 class="mt-6 text-center text-4xl font-extrabold text-white">
            Join Our Community
          </h2>
          <p class="mt-2 text-center text-lg text-white/80">
            Start your journey with us today
          </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="glass-container p-8">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Name Fields -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700">
                    <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
                    First name
                  </label>
                  <div class="mt-1">
                    <input id="firstName" 
                           type="text" 
                           formControlName="firstName"
                           class="input-field" 
                           placeholder="John"
                           required>
                    @if (registerForm.get('firstName')?.errors?.['required'] && registerForm.get('firstName')?.touched) {
                      <p class="mt-1 text-sm text-red-600">First name is required</p>
                    }
                  </div>
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700">
                    <fa-icon [icon]="faUser" class="mr-2"></fa-icon>
                    Last name
                  </label>
                  <div class="mt-1">
                    <input id="lastName" 
                           type="text" 
                           formControlName="lastName"
                           class="input-field" 
                           placeholder="Doe"
                           required>
                    @if (registerForm.get('lastName')?.errors?.['required'] && registerForm.get('lastName')?.touched) {
                      <p class="mt-1 text-sm text-red-600">Last name is required</p>
                    }
                  </div>
                </div>
              </div>

              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  <fa-icon [icon]="faEnvelope" class="mr-2"></fa-icon>
                  Email address
                </label>
                <div class="mt-1">
                  <input id="email" 
                         type="email" 
                         formControlName="email"
                         class="input-field" 
                         placeholder="your@email.com"
                         required>
                  @if (registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Email is required</p>
                  }
                  @if (registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Please enter a valid email</p>
                  }
                </div>
              </div>

              <!-- Password Fields -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  <fa-icon [icon]="faLock" class="mr-2"></fa-icon>
                  Password
                </label>
                <div class="mt-1">
                  <input id="password" 
                         type="password" 
                         formControlName="password"
                         class="input-field" 
                         placeholder="••••••••"
                         required>
                  @if (registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Password is required</p>
                  }
                  @if (registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Password must be at least 6 characters</p>
                  }
                </div>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  <fa-icon [icon]="faLock" class="mr-2"></fa-icon>
                  Confirm password
                </label>
                <div class="mt-1">
                  <input id="confirmPassword" 
                         type="password" 
                         formControlName="confirmPassword"
                         class="input-field" 
                         placeholder="••••••••"
                         required>
                  @if (registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Passwords do not match</p>
                  }
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button type="submit" 
                        [disabled]="!registerForm.valid"
                        class="w-full btn-primary flex justify-center items-center">
                  <fa-icon [icon]="faUserPlus" class="mr-2"></fa-icon>
                  Create account
                </button>
              </div>
            </form>

            <!-- Login Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Already have an account?
                <a routerLink="/auth/login" 
                   class="font-medium text-primary-600 hover:text-primary-500 hover:underline">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUserPlus = faUserPlus;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register form submitted:', this.registerForm.value);
      // TODO: Implement registration logic
    }
  }
}