import { signal } from '@angular/core';
import { throwError, of } from 'rxjs';
import { AuthResponse, User } from '../../models/auth.model';
import { AuthApiService } from './auth-api.service';
import { AuthFacadeService } from './auth-facade.service';
import { AuthStoreService } from './auth-store.service';

describe('AuthFacadeService', () => {
  let service: AuthFacadeService;
  let api: jest.Mocked<Pick<AuthApiService, 'signin' | 'signup'>>;
  let store: jest.Mocked<
    Pick<AuthStoreService, 'setLoading' | 'setError' | 'setToken' | 'setUser' | 'clearAuth'>
  > & {
    user: ReturnType<typeof signal<User | null>>;
    token: ReturnType<typeof signal<string | null>>;
    isLoggedIn: ReturnType<typeof signal<boolean>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };
  let router: { navigate: jest.Mock };

  const authResponse: AuthResponse = {
    token: 'token-123',
    user: {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    },
  };

  beforeEach(() => {
    api = {
      signin: jest.fn(),
      signup: jest.fn(),
    };

    store = {
      user: signal(null),
      token: signal(null),
      isLoggedIn: signal(false),
      loading: signal(false),
      error: signal(null),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setToken: jest.fn(),
      setUser: jest.fn(),
      clearAuth: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    service = new AuthFacadeService(
      api as unknown as AuthApiService,
      store as unknown as AuthStoreService,
      router as never,
    );
  });

  it('returns auth store signals', () => {
    expect(service.getUser()).toBe(store.user);
    expect(service.getToken()).toBe(store.token);
    expect(service.isLoggedIn()).toBe(store.isLoggedIn);
    expect(service.isLoading()).toBe(store.loading);
    expect(service.getError()).toBe(store.error);
  });

  it('navigates between auth screens', () => {
    service.navigateToSignin();
    service.navigateToSignup();

    expect(router.navigate).toHaveBeenNthCalledWith(1, ['/signin']);
    expect(router.navigate).toHaveBeenNthCalledWith(2, ['/signup']);
  });

  it('stores auth data and navigates after successful signup', () => {
    api.signup.mockReturnValue(of(authResponse));

    service.signup('Ada Lovelace', 'ada@example.com', 'secret');

    expect(store.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(store.setError).toHaveBeenCalledWith(null);
    expect(store.setToken).toHaveBeenCalledWith('token-123');
    expect(store.setUser).toHaveBeenCalledWith(authResponse.user);
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/chat']);
  });

  it('sets a fallback signup error when signup fails without a message', () => {
    api.signup.mockReturnValue(throwError(() => ({ error: {} })));

    service.signup('Ada Lovelace', 'ada@example.com', 'secret');

    expect(store.setError).toHaveBeenCalledWith('Signup failed');
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('stores auth data and navigates after successful signin', () => {
    api.signin.mockReturnValue(of(authResponse));

    service.signin('ada@example.com', 'secret');

    expect(store.setToken).toHaveBeenCalledWith('token-123');
    expect(store.setUser).toHaveBeenCalledWith(authResponse.user);
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/chat']);
  });

  it('sets a server signin error message when signin fails', () => {
    api.signin.mockReturnValue(throwError(() => ({ error: { message: 'Bad credentials' } })));

    service.signin('ada@example.com', 'wrong');

    expect(store.setError).toHaveBeenCalledWith('Bad credentials');
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('clears auth and navigates on logout', () => {
    service.logout();

    expect(store.clearAuth).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });
});
