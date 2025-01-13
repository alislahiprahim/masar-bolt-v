import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user.model";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Check for stored user data on initialization
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string): boolean {
    // TODO: Implement actual authentication logic
    // This is a mock implementation
    const mockUser: User = {
      id: "1",
      email,
      firstName: "John",
      lastName: "Doe",
    };
    if (isPlatformBrowser(this.platformId))
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return true;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId))
      localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
