import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  private _user = signal<User | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null'), // ← restore on init
  );
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly user = computed(() => this._user());
  readonly token = computed(() => this._token());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly isLoggedIn = computed(() => !!this._token());

  setUser(user: User | null): void {
    this._user.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // ← persist
    } else {
      localStorage.removeItem('user');
    }
  }

  setToken(token: string | null): void {
    this._token.set(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearAuth(): void {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ← clear both
  }
}
