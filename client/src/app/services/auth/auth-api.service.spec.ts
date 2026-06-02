import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../../models/auth.model';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/auth`;

  const authResponse: AuthResponse = {
    token: 'token-123',
    user: {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts signup credentials to the auth signup endpoint', () => {
    service.signup('Ada Lovelace', 'ada@example.com', 'secret').subscribe((response) => {
      expect(response).toEqual(authResponse);
    });

    const request = httpMock.expectOne(`${apiUrl}/signup`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret',
    });
    request.flush(authResponse);
  });

  it('posts signin credentials to the auth signin endpoint', () => {
    service.signin('ada@example.com', 'secret').subscribe((response) => {
      expect(response).toEqual(authResponse);
    });

    const request = httpMock.expectOne(`${apiUrl}/signin`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'ada@example.com',
      password: 'secret',
    });
    request.flush(authResponse);
  });
});
