import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, catchError, map, of, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthStateService } from "../state/auth.state";
import { ToastService } from "./toast.service";
import {
  AuthResponse,
  LoginCredentials,
  UserDetails,
} from "../models/auth.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authState: AuthStateService,
    private toastService: ToastService
  ) {}

  login(credentials: LoginCredentials): Observable<boolean> {
    this.authState.setLoading(true);
    this.authState.setError(null);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        ...credentials,
        userType: 2,
      })
      .pipe(
        tap((response) => {
          if (response.isSuccess) {
            this.authState.setToken(response.content?.token);
            this.authState.setUser(response.content?.userDetails);
            this.toastService.success("Successfully logged in");
          } else {
            const message =
              response?.responseMessage || "An error occurred during login";
            this.authState.setError(message);
            this.toastService.error(message);
          }
        }),
        map((response: AuthResponse) => response.isSuccess),
        catchError((error) => {
          const message =
            error.error?.message || "An error occurred during login";
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
        catchError((error) => {
          console.error("Error during logout:", error);
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
    this.toastService.info("You have been logged out");
  }

  refreshToken(): Observable<boolean> {
    const token = this.authState.token();
    if (!token) return of(false);

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap((response) => {
        this.authState.setToken(response.content?.token);
        this.authState.setUser(response.content?.userDetails);
      }),
      map(() => true),
      catchError((error) => {
        console.error("Error refreshing token:", error);
        this.handleLogout();
        return of(false);
      })
    );
  }

  updateProfile(details: Partial<UserDetails>): Observable<UserDetails> {
    return this.http.patch<UserDetails>(`${this.apiUrl}/profile`, details).pipe(
      tap((user) => {
        this.authState.updateUserDetails(user);
        this.toastService.success("Profile updated successfully");
      }),
      catchError((error) => {
        const message = error.error?.message || "Error updating profile";
        this.toastService.error(message);
        return throwError(() => new Error(message));
      })
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<boolean> {
    return this.http
      .post<void>(`${this.apiUrl}/change-password`, {
        currentPassword,
        newPassword,
      })
      .pipe(
        tap(() => this.toastService.success("Password changed successfully")),
        map(() => true),
        catchError((error) => {
          const message = error.error?.message || "Error changing password";
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
