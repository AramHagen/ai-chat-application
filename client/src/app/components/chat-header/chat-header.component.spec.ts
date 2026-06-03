import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatHeaderComponent } from './chat-header.component';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';

describe('ChatHeaderComponent', () => {
  let component: ChatHeaderComponent;
  let fixture: ComponentFixture<ChatHeaderComponent>;
  let authFacadeMock: jest.Mocked<Pick<AuthFacadeService, 'logout'>>;

  beforeEach(async () => {
    authFacadeMock = { logout: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ChatHeaderComponent],
      providers: [{ provide: AuthFacadeService, useValue: authFacadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders the title and avatar inputs', () => {
    fixture.componentRef.setInput('title', 'Project Chat');
    fixture.componentRef.setInput('avatar', '/avatar.svg');
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(fixture.nativeElement.textContent).toContain('Project Chat');
    expect(image.src).toContain('/avatar.svg');
    expect(image.alt).toBe('Project Chat');
  });

  it('calls logout on sign out click', () => {
    component.onSignOut();

    expect(authFacadeMock.logout).toHaveBeenCalled();
  });
});
