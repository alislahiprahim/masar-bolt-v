import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignInAlt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="min-h-screen relative bg-gradient-to-br from-primary-50 to-secondary-50">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080"
             alt="Login Background"
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <!-- Login Form Container -->
      <div class="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <!-- Logo or Brand -->
          <img src="/assets/logo.png" alt="Masar Logo" class="mx-auto h-16 w-auto">
          <h2 class="mt-6 text-center text-4xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p class="mt-2 text-center text-lg text-white/80">
            Sign in to continue your journey
          </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="glass-container p-8">
            @if (error) {
              <div class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative" role="alert">
                <span class="block sm:inline">{{ error }}</span>
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                  @if (loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Email is required</p>
                  }
                  @if (loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Please enter a valid email</p>
                  }
                </div>
              </div>

              <!-- Password Field -->
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
                  @if (loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched) {
                    <p class="mt-1 text-sm text-red-600">Password is required</p>
                  }
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember_me" 
                         type="checkbox"
                         formControlName="rememberMe"
                         class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                  <label for="remember_me" class="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button type="button" 
                        class="text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline focus:outline-none">
                  Forgot password?
                </button>
              </div>

              <!-- Submit Button -->
              <div>
                <button type="submit" 
                        [disabled]="!loginForm.valid || isLoading"
                        class="w-full btn-primary flex justify-center items-center">
                  <fa-icon [icon]="faSignInAlt" class="mr-2"></fa-icon>
                  {{ isLoading ? 'Signing in...' : 'Sign in' }}
                </button>
              </div>
            </form>

            <!-- Register Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <a routerLink="/auth/register" 
                   class="font-medium text-primary-600 hover:text-primary-500 hover:underline">
                  Create one now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  faSignInAlt = faSignInAlt;
  faEnvelope = faEnvelope;
  faLock = faLock;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      const { email, password } = this.loginForm.value;
      
      try {
        const success = this.authService.login(email, password);
        
        if (success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        } else {
          this.error = 'Invalid email or password';
        }
      } catch (err) {
        this.error = 'An error occurred during sign in';
      } finally {
        this.isLoading = false;
      }
    }
  }
}