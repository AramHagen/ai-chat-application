import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('updates the message when typing', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

    textarea.value = 'Hello there';
    textarea.dispatchEvent(new Event('input'));

    expect(component.message()).toBe('Hello there');
  });

  it('emits and clears a non-empty message on send', () => {
    const messageSpy = jest.fn();
    component.messageSent.subscribe(messageSpy);
    component.message.set('Hello AI');
    component.showEmojiPicker.set(true);

    component.onSend();

    expect(messageSpy).toHaveBeenCalledWith('Hello AI');
    expect(component.message()).toBe('');
    expect(component.showEmojiPicker()).toBe(false);
  });

  it('does not emit blank messages', () => {
    const messageSpy = jest.fn();
    component.messageSent.subscribe(messageSpy);
    component.message.set('   ');

    component.onSend();

    expect(messageSpy).not.toHaveBeenCalled();
  });

  it('sends on enter without shift', () => {
    const messageSpy = jest.fn();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'preventDefault');
    component.messageSent.subscribe(messageSpy);
    component.message.set('Keyboard send');

    component.onKeyPress(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(messageSpy).toHaveBeenCalledWith('Keyboard send');
  });

  it('toggles the emoji picker from the emoji button', () => {
    const emojiButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Open emoji picker"]',
    );

    emojiButton.click();
    fixture.detectChanges();

    expect(component.showEmojiPicker()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('😀');
  });

  it('adds a selected emoji to the message', () => {
    component.message.set('Nice ');
    component.showEmojiPicker.set(true);
    fixture.detectChanges();

    const emojiButton: HTMLButtonElement = fixture.nativeElement.querySelector('.grid button');
    emojiButton.click();

    expect(component.message()).toBe('Nice 😀');
    expect(component.showEmojiPicker()).toBe(false);
  });
});
