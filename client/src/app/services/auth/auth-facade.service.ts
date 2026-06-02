import { Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { AuthStoreService } from './auth-store.service';
import { User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  constructor(
    private api: AuthApiService,
    private store: AuthStoreService,
    private router: Router,
  ) {}

  // ── Getters ──
  getUser(): Signal<User | null> {
    return this.store.user;
  }

  getToken(): Signal<string | null> {
    return this.store.token;
  }

  isLoggedIn(): Signal<boolean> {
    return this.store.isLoggedIn;
  }

  isLoading(): Signal<boolean> {
    return this.store.loading;
  }

  getError(): Signal<string | null> {
    return this.store.error;
  }

  navigateToSignin(): void {
    this.router.navigate(['/signin']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  // ── Init ──
  // ── Init ──
  initAuth(): void {
    const token = this.store.token();

    // Both are already restored from localStorage by the store.
    // If token is missing, send to signin.
    if (!token) {
      this.router.navigate(['/signin']);
    }
  }

  // ── Actions ──
  signup(name: string, email: string, password: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api.signup(name, email, password).subscribe({
      next: (response) => {
        this.store.setToken(response.token);
        this.store.setUser(response.user);
        this.store.setLoading(false);
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Signup failed');
        this.store.setLoading(false);
      },
    });
  }

  signin(email: string, password: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api.signin(email, password).subscribe({
      next: (response) => {
        this.store.setToken(response.token);
        this.store.setUser(response.user);
        this.store.setLoading(false);
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Invalid email or password');
        this.store.setLoading(false);
      },
    });
  }

  logout(): void {
    this.store.clearAuth();
    this.router.navigate(['/signin']);
  }
}
