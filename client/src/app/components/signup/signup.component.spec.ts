import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authFacade: {
    isLoading: jest.Mock;
    getError: jest.Mock;
    signup: jest.Mock;
    navigateToSignin: jest.Mock;
  };

  beforeEach(async () => {
    authFacade = {
      isLoading: jest.fn(() => signal(false)),
      getError: jest.fn(() => signal(null)),
      signup: jest.fn(),
      navigateToSignin: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [{ provide: AuthFacadeService, useValue: authFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('submits account details through the auth facade', () => {
    component.name = 'Ada Lovelace';
    component.email = 'ada@example.com';
    component.password = 'secret';

    component.onSignup();

    expect(authFacade.signup).toHaveBeenCalledWith('Ada Lovelace', 'ada@example.com', 'secret');
  });

  it('navigates to signin', () => {
    component.goToSignin();

    expect(authFacade.navigateToSignin).toHaveBeenCalled();
  });

  it('renders an error message from the auth facade', () => {
    authFacade.getError.mockReturnValue(signal('Signup failed'));
    fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Signup failed');
  });
});
