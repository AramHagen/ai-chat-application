import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Message } from '../../models/chat.model';
import { MessageListComponent } from './message-list.component';

const messages: Message[] = [
  {
    _id: 'message-1',
    chatId: 'chat-1',
    role: 'user',
    content: 'Question',
    feedback: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'message-2',
    chatId: 'chat-1',
    role: 'assistant',
    content: 'Answer',
    feedback: null,
    createdAt: '2026-01-01T00:00:01.000Z',
    updatedAt: '2026-01-01T00:00:01.000Z',
  },
];

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders all messages', () => {
    expect(fixture.nativeElement.textContent).toContain('Question');
    expect(fixture.nativeElement.textContent).toContain('Answer');
  });

  it('marks only the last assistant message as last AI message', () => {
    expect(component.isLastAIMessage(0)).toBe(false);
    expect(component.isLastAIMessage(1)).toBe(true);
  });

  it('emits feedback with the message id', () => {
    const feedbackSpy = jest.fn();
    component.feedbackGiven.subscribe(feedbackSpy);

    component.onFeedback('positive', 'message-2');

    expect(feedbackSpy).toHaveBeenCalledWith({ messageId: 'message-2', feedback: 'positive' });
  });
});
