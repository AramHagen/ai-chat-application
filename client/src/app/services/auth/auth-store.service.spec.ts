import { User } from '../../models/auth.model';
import { AuthStoreService } from './auth-store.service';

describe('AuthStoreService', () => {
  let service: AuthStoreService;

  const user: User = {
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  };

  beforeEach(() => {
    localStorage.clear();
    service = new AuthStoreService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with token from localStorage when present', () => {
    localStorage.setItem('token', 'stored-token');

    service = new AuthStoreService();

    expect(service.token()).toBe('stored-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('sets user, token, loading, and error state', () => {
    service.setUser(user);
    service.setToken('token-123');
    service.setLoading(true);
    service.setError('Something went wrong');

    expect(service.user()).toEqual(user);
    expect(service.token()).toBe('token-123');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.loading()).toBe(true);
    expect(service.error()).toBe('Something went wrong');
    expect(localStorage.getItem('token')).toBe('token-123');
  });

  it('removes token state when token is set to null', () => {
    service.setToken('token-123');

    service.setToken(null);

    expect(service.token()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('clears auth state', () => {
    service.setUser(user);
    service.setToken('token-123');

    service.clearAuth();

    expect(service.user()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
