import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Message } from '../../models/chat.model';
import { MessageItemComponent } from './message-item.component';

const baseMessage: Message = {
  _id: 'message-1',
  chatId: 'chat-1',
  role: 'assistant',
  content: 'Here is a useful answer.',
  feedback: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('MessageItemComponent', () => {
  let component: MessageItemComponent;
  let fixture: ComponentFixture<MessageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', baseMessage);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders assistant messages with the AI label', () => {
    expect(fixture.nativeElement.textContent).toContain('AI');
    expect(fixture.nativeElement.textContent).toContain(baseMessage.content);
  });

  it('renders user messages without feedback buttons', () => {
    fixture.componentRef.setInput('message', { ...baseMessage, role: 'user', content: 'Hello AI' });
    fixture.componentRef.setInput('isLast', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hello AI');
    expect(fixture.nativeElement.querySelector('button[title="Helpful"]')).toBeNull();
  });

  it('emits feedback from the assistant feedback buttons', () => {
    const feedbackSpy = jest.fn();
    component.feedbackGiven.subscribe(feedbackSpy);
    fixture.componentRef.setInput('isLast', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    buttons[1].click();

    expect(feedbackSpy).toHaveBeenNthCalledWith(1, 'positive');
    expect(feedbackSpy).toHaveBeenNthCalledWith(2, 'negative');
  });
});
