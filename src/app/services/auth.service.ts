import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStateService } from '../state/auth.state';
import { ToastService } from './toast.service';
import {
  AuthResponse,
  CheckPhoneResponse,
  LoginCredentials,
  RegisterCredentials,
  UserDetails,
} from '../models/auth.model';
import { DialogService } from './dialog.service';
import { ReservationService } from './reservation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authState: AuthStateService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private reservationService: ReservationService
  ) {}

  login(credentials: LoginCredentials): Observable<boolean> {
    this.authState.setLoading(true);
    this.authState.setError(null);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        ...credentials,
        roleIds: [1],
      })
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            this.authState.setToken(response.data?.token);
            this.authState.setRefreshToken(response.data?.refreshToken);
            this.authState.setUser(response.data?.user);
            this.toastService.success('Successfully logged in');
            this.reservationService.setUserReservationsInLocalStorage(
              response.data.user.reservations
            );
          } else {
            const message = response?.message || 'An error occurred during login';
            this.authState.setError(message);
            this.toastService.error(message);
          }
        }),
        map((response: AuthResponse) => response.status === 'success'),
        catchError(error => {
          const message = error.error?.message || 'An error occurred during login';
          this.authState.setError(message);
          this.toastService.error(message);
          return of(false);
        })
      );
  }

  register(credentials: RegisterCredentials): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.authState.setToken(response.data?.token);
          this.authState.setRefreshToken(response.data?.refreshToken);
          this.authState.setUser(response.data?.user);
          this.toastService.success('Successfully registered');
        } else {
          const message = response?.message || 'An error occurred during registration';
          this.authState.setError(message);
          this.toastService.error(message);
        }
      }),
      map((response: AuthResponse) => response.status === 'success'),
      catchError(error => {
        const message = error.error?.message || 'An error occurred during registration';
        this.authState.setError(message);
        this.toastService.error(message);
        return of(false);
      })
    );
  }

  checkPhoneNumber(phoneNumber: string): Observable<boolean> {
    return this.http
      .post<CheckPhoneResponse>(`${this.apiUrl}/check-phone`, {
        phoneNumber,
      })
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            response.data.exists
              ? this.dialogService.success('auth.phone_already_registered')
              : this.dialogService.error('auth.phone_not_registered');
          } else {
            const message = response?.responseMessage || 'An error occurred during registration';
            this.authState.setError(message);
            this.toastService.error(message);
          }
        }),
        map(
          (response: CheckPhoneResponse) => response.status === 'success' && response.data.exists
        ),
        catchError(error => {
          const message = error.error?.message || 'An error occurred during login';
          this.authState.setError(message);
          this.toastService.error(message);
          return of(false);
        })
      );
  }
  logout(): void {
    // Optionally call logout endpoint
    this.http
      .post(`${this.apiUrl}/logout`, {})
      .pipe(
        catchError(error => {
          console.error('Error during logout:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        this.handleLogout();
      });
  }

  private handleLogout(): void {
    this.authState.clearAuth();
    // this.router.navigate(["/auth/login"]);
    this.toastService.info('You have been logged out');
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = this.authState.refreshToken();
    if (!refreshToken) return of(false);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, {
        refreshToken,
      })
      .pipe(
        tap(response => {
          this.authState.setToken(response.data?.token);
          this.authState.setRefreshToken(response.data?.refreshToken);
        }),
        map(() => true),
        catchError(error => {
          console.error('Error refreshing token:', error);
          this.handleLogout();
          return of(false);
        })
      );
  }

  updateProfile(details: Partial<UserDetails>): Observable<UserDetails> {
    return this.http.patch<UserDetails>(`${this.apiUrl}/profile`, details).pipe(
      tap(user => {
        this.authState.updateUserDetails(user);
        this.toastService.success('Profile updated successfully');
      }),
      catchError(error => {
        const message = error.error?.message || 'Error updating profile';
        this.toastService.error(message);
        return throwError(() => new Error(message));
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http
      .post<void>(`${this.apiUrl}/change-password`, {
        currentPassword,
        newPassword,
      })
      .pipe(
        tap(() => this.toastService.success('Password changed successfully')),
        map(() => true),
        catchError(error => {
          const message = error.error?.message || 'Error changing password';
          this.toastService.error(message);
          return throwError(() => new Error(message));
        })
      );
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated();
  }

  getCurrentUser(): UserDetails | null {
    return this.authState.user();
  }

  getAuthToken(): string | null {
    return this.authState.token();
  }
}
