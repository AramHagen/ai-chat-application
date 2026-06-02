import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';
import { SigninComponent } from './signin.component';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let authFacade: {
    isLoading: jest.Mock;
    getError: jest.Mock;
    signin: jest.Mock;
    navigateToSignup: jest.Mock;
  };

  beforeEach(async () => {
    authFacade = {
      isLoading: jest.fn(() => signal(false)),
      getError: jest.fn(() => signal(null)),
      signin: jest.fn(),
      navigateToSignup: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SigninComponent],
      providers: [{ provide: AuthFacadeService, useValue: authFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('submits credentials through the auth facade', () => {
    component.email = 'user@example.com';
    component.password = 'secret';

    component.onSignin();

    expect(authFacade.signin).toHaveBeenCalledWith('user@example.com', 'secret');
  });

  it('navigates to signup', () => {
    component.goToSignup();

    expect(authFacade.navigateToSignup).toHaveBeenCalled();
  });

  it('renders an error message from the auth facade', async () => {
    authFacade.getError.mockReturnValue(signal('Invalid email or password'));
    fixture = TestBed.createComponent(SigninComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invalid email or password');
  });
});
