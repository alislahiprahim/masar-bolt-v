import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { AuthState, UserDetails } from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  platformId = inject(PLATFORM_ID);

  private state = signal<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
  });

  // Computed signals for components
  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isAuthenticated = computed(() => !!this.state().token);
  readonly reservedTripIds = computed(() => this.state().user?.reservedTripIds || []);

  constructor() {
    this.loadFromStorage();
  }

  setUser(user: UserDetails | null) {
    this.state.update(state => ({
      ...state,
      user,
      error: null,
    }));
    this.saveToStorage();
  }

  setToken(token: string | null) {
    this.state.update(state => ({
      ...state,
      token,
      error: null,
    }));
    this.saveToStorage();
  }

  setRefreshToken(token: string | null) {
    this.state.update(state => ({
      ...state,
      refreshToken: token,
      error: null,
    }));
    this.saveToStorage();
  }

  setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading,
    }));
  }

  setError(error: string | null) {
    this.state.update(state => ({
      ...state,
      error,
      loading: false,
    }));
  }

  addReservedTrip(tripId: string) {
    if (!this.state().user) return;

    this.state.update(state => ({
      ...state,
      user: state.user
        ? {
            ...state.user,
            reservedTripIds: [...state.user.reservedTripIds, tripId],
          }
        : null,
    }));
    this.saveToStorage();
  }

  removeReservedTrip(tripId: string) {
    if (!this.state().user) return;

    this.state.update(state => ({
      ...state,
      user: state.user
        ? {
            ...state.user,
            reservedTripIds: state.user.reservedTripIds.filter(id => id !== tripId),
          }
        : null,
    }));
    this.saveToStorage();
  }

  updateUserDetails(details: Partial<UserDetails>) {
    if (!this.state().user) return;

    this.state.update(state => ({
      ...state,
      user: state.user ? { ...state.user, ...details } : null,
    }));
    this.saveToStorage();
  }

  clearAuth() {
    this.state.set({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,
    });
    this.clearStorage();
  }

  private saveToStorage() {
    const { user, token, refreshToken } = this.state();
    if (user && token && isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_refreshToken', refreshToken || '');
    }
  }

  private loadFromStorage() {
    try {
      if (!isPlatformBrowser(this.platformId)) return;
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');

      if (storedUser && storedToken) {
        this.state.set({
          user: JSON.parse(storedUser),
          token: storedToken,
          refreshToken: localStorage.getItem('auth_refreshToken'),
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
      this.clearStorage();
    }
  }

  private clearStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refreshToken');
  }
}
