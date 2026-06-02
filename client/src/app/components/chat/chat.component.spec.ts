import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Chat, Message } from '../../models/chat.model';
import { ChatFacadeService } from '../../services/chat/chat-facade.service';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';
import { ChatComponent } from './chat.component';

const chat: Chat = {
  _id: 'chat-1',
  userId: 'user-1',
  title: 'Existing chat',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const message: Message = {
  _id: 'message-1',
  chatId: 'chat-1',
  role: 'assistant',
  content: 'Hello',
  feedback: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let selectedChat = signal<Chat | null>(chat);
  let authFacade: {
    getUser: jest.Mock;
  };
  let chatFacade: {
    getChats: jest.Mock;
    getMessages: jest.Mock;
    getSelectedChat: jest.Mock;
    isLoading: jest.Mock;
    loadChats: jest.Mock;
    sendMessage: jest.Mock;
    sendFirstMessage: jest.Mock;
    selectChat: jest.Mock;
    deleteChat: jest.Mock;
    newChat: jest.Mock;
    submitFeedback: jest.Mock;
  };

  beforeEach(async () => {
    selectedChat = signal<Chat | null>(chat);
    chatFacade = {
      getChats: jest.fn(() => signal([chat])),
      getMessages: jest.fn(() => signal([message])),
      getSelectedChat: jest.fn(() => selectedChat),
      isLoading: jest.fn(() => signal(false)),
      loadChats: jest.fn(),
      sendMessage: jest.fn(),
      sendFirstMessage: jest.fn(),
      selectChat: jest.fn(),
      deleteChat: jest.fn(),
      newChat: jest.fn(),
      submitFeedback: jest.fn(),
    };
    authFacade = {
      getUser: jest.fn(() =>
        signal({
          id: 'user-1',
          name: 'Andrew Neilson',
          email: 'andrew@example.com',
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatFacadeService, useValue: chatFacade },
        { provide: AuthFacadeService, useValue: authFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and loads chats on init', () => {
    expect(component).toBeTruthy();
    expect(chatFacade.loadChats).toHaveBeenCalled();
  });

  it('sends messages to the selected chat', () => {
    component.onMessageSent('Hello again');

    expect(chatFacade.sendMessage).toHaveBeenCalledWith('Hello again');
    expect(chatFacade.sendFirstMessage).not.toHaveBeenCalled();
  });

  it('sends the first message when no chat is selected', () => {
    selectedChat.set(null);

    component.onMessageSent('Start a chat');

    expect(chatFacade.sendFirstMessage).toHaveBeenCalledWith('Start a chat');
  });

  it('forwards chat actions to the facade', () => {
    component.onSelectChat(chat);
    component.onDeleteChat(chat._id);
    component.onNewChat();
    component.onFeedback({ messageId: message._id, feedback: 'negative' });

    expect(chatFacade.selectChat).toHaveBeenCalledWith(chat);
    expect(chatFacade.deleteChat).toHaveBeenCalledWith(chat._id);
    expect(chatFacade.newChat).toHaveBeenCalled();
    expect(chatFacade.submitFeedback).toHaveBeenCalledWith(message._id, 'negative');
  });

  it('renders selected chat content', () => {
    expect(fixture.nativeElement.textContent).toContain('Existing chat');
    expect(fixture.nativeElement.textContent).toContain('Hello');
  });

  it('passes the current user name to the sidebar', () => {
    expect(fixture.nativeElement.textContent).toContain('Andrew Neilson');
  });
});
