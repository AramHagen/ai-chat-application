import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chat } from '../../models/chat.model';
import { SidebarComponent } from './sidebar.component';

const chats: Chat[] = [
  {
    _id: 'chat-1',
    userId: 'user-1',
    title: 'First chat',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'chat-2',
    userId: 'user-1',
    title: 'Second chat',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('chats', chats);
    fixture.componentRef.setInput('selectedChatId', 'chat-2');
    fixture.componentRef.setInput('userName', 'Andrew Neilson');
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders chat titles', () => {
    expect(fixture.nativeElement.textContent).toContain('First chat');
    expect(fixture.nativeElement.textContent).toContain('Second chat');
  });

  it('renders the user name and avatar initial in the footer', () => {
    expect(fixture.nativeElement.textContent).toContain('Andrew Neilson');
    expect(fixture.nativeElement.textContent).toContain('A');
    expect(fixture.nativeElement.textContent).not.toContain('Settings');
  });

  it('falls back to a generic user name and initial when the name is blank', () => {
    fixture.componentRef.setInput('userName', '   ');
    fixture.detectChanges();

    expect(component.displayUserName()).toBe('User');
    expect(component.userInitial()).toBe('U');
  });

  it('shows an empty state when there are no chats', () => {
    fixture.componentRef.setInput('chats', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No conversations yet');
  });

  it('emits when creating and selecting chats', () => {
    const newChatSpy = jest.fn();
    const selectChatSpy = jest.fn();
    component.newChat.subscribe(newChatSpy);
    component.selectChat.subscribe(selectChatSpy);

    component.onNewChat();
    component.onSelectChat(chats[0]);

    expect(newChatSpy).toHaveBeenCalled();
    expect(selectChatSpy).toHaveBeenCalledWith(chats[0]);
  });

  it('stops propagation and emits when deleting a chat', () => {
    const event = new Event('click');
    const deleteChatSpy = jest.fn();
    jest.spyOn(event, 'stopPropagation');
    component.deleteChat.subscribe(deleteChatSpy);

    component.onDeleteChat(event, 'chat-1');

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(deleteChatSpy).toHaveBeenCalledWith('chat-1');
  });
});
