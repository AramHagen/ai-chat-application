import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatHeaderComponent } from './chat-header.component';

describe('ChatHeaderComponent', () => {
  let component: ChatHeaderComponent;
  let fixture: ComponentFixture<ChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHeaderComponent],
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

  it('handles settings clicks', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    component.onSettings();

    expect(consoleSpy).toHaveBeenCalledWith('Settings clicked');
    consoleSpy.mockRestore();
  });
});
