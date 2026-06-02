import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
  Chat,
  Message,
  SendFirstMessageResponse,
  SendMessageResponse,
} from '../../models/chat.model';
import { ChatApiService } from './chat-api.service';
import { ChatFacadeService } from './chat-facade.service';
import { ChatStoreService } from './chat-store.service';

describe('ChatFacadeService', () => {
  let service: ChatFacadeService;
  let selectedChat = signal<Chat | null>(null);
  let api: jest.Mocked<
    Pick<
      ChatApiService,
      | 'getChats'
      | 'getMessages'
      | 'sendFirstMessage'
      | 'sendMessage'
      | 'deleteChat'
      | 'submitFeedback'
    >
  >;
  let store: jest.Mocked<
    Pick<
      ChatStoreService,
      | 'setLoading'
      | 'setError'
      | 'setChats'
      | 'setSelectedChat'
      | 'clearMessages'
      | 'setMessages'
      | 'addChat'
      | 'addMessage'
      | 'removeChat'
      | 'updateMessageFeedback'
    >
  > & {
    chats: ReturnType<typeof signal<Chat[]>>;
    selectedChat: typeof selectedChat;
    messages: ReturnType<typeof signal<Message[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };

  const chat: Chat = {
    _id: 'chat-1',
    userId: 'user-1',
    title: 'First chat',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  const userMessage: Message = {
    _id: 'message-1',
    chatId: 'chat-1',
    role: 'user',
    content: 'Hello',
    feedback: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  const assistantMessage: Message = {
    ...userMessage,
    _id: 'message-2',
    role: 'assistant',
    content: 'Hi there',
  };

  beforeEach(() => {
    selectedChat = signal<Chat | null>(null);

    api = {
      getChats: jest.fn(),
      getMessages: jest.fn(),
      sendFirstMessage: jest.fn(),
      sendMessage: jest.fn(),
      deleteChat: jest.fn(),
      submitFeedback: jest.fn(),
    };

    store = {
      chats: signal([]),
      selectedChat,
      messages: signal([]),
      loading: signal(false),
      error: signal(null),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setChats: jest.fn(),
      setSelectedChat: jest.fn(),
      clearMessages: jest.fn(),
      setMessages: jest.fn(),
      addChat: jest.fn(),
      addMessage: jest.fn(),
      removeChat: jest.fn(),
      updateMessageFeedback: jest.fn(),
    };

    service = new ChatFacadeService(
      api as unknown as ChatApiService,
      store as unknown as ChatStoreService,
    );
  });

  it('returns chat store signals', () => {
    expect(service.getChats()).toBe(store.chats);
    expect(service.getSelectedChat()).toBe(store.selectedChat);
    expect(service.getMessages()).toBe(store.messages);
    expect(service.isLoading()).toBe(store.loading);
    expect(service.getError()).toBe(store.error);
  });

  it('loads chats successfully', () => {
    api.getChats.mockReturnValue(of([chat]));

    service.loadChats();

    expect(store.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(store.setChats).toHaveBeenCalledWith([chat]);
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('sets a fallback error when loading chats fails', () => {
    api.getChats.mockReturnValue(throwError(() => ({ error: {} })));

    service.loadChats();

    expect(store.setError).toHaveBeenCalledWith('Failed to load chats');
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('selects a chat and loads its messages', () => {
    api.getMessages.mockReturnValue(of([userMessage, assistantMessage]));

    service.selectChat(chat);

    expect(store.setSelectedChat).toHaveBeenCalledWith(chat);
    expect(store.clearMessages).toHaveBeenCalled();
    expect(api.getMessages).toHaveBeenCalledWith(chat._id);
    expect(store.setMessages).toHaveBeenCalledWith([userMessage, assistantMessage]);
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('creates a chat from the first message', () => {
    const response: SendFirstMessageResponse = {
      chat,
      userMessage,
      assistantMessage,
    };
    api.sendFirstMessage.mockReturnValue(of(response));

    service.sendFirstMessage('Hello');

    expect(api.sendFirstMessage).toHaveBeenCalledWith('Hello');
    expect(store.addChat).toHaveBeenCalledWith(chat);
    expect(store.setSelectedChat).toHaveBeenCalledWith(chat);
    expect(store.setMessages).toHaveBeenCalledWith([userMessage, assistantMessage]);
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('sends a message when a chat is selected', () => {
    const response: SendMessageResponse = {
      userMessage,
      assistantMessage,
    };
    selectedChat.set(chat);
    api.sendMessage.mockReturnValue(of(response));

    service.sendMessage('Hello again');

    expect(api.sendMessage).toHaveBeenCalledWith(chat._id, 'Hello again');
    expect(store.addMessage).toHaveBeenNthCalledWith(1, userMessage);
    expect(store.addMessage).toHaveBeenNthCalledWith(2, assistantMessage);
    expect(store.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('does nothing when sending a message without a selected chat', () => {
    service.sendMessage('Hello');

    expect(api.sendMessage).not.toHaveBeenCalled();
    expect(store.setLoading).not.toHaveBeenCalled();
  });

  it('removes a chat after delete succeeds', () => {
    api.deleteChat.mockReturnValue(of({ message: 'Deleted' }));

    service.deleteChat(chat._id);

    expect(api.deleteChat).toHaveBeenCalledWith(chat._id);
    expect(store.removeChat).toHaveBeenCalledWith(chat._id);
  });

  it('updates message feedback after submit succeeds', () => {
    api.submitFeedback.mockReturnValue(of({ message: 'Done' }));

    service.submitFeedback(assistantMessage._id, 'negative');

    expect(api.submitFeedback).toHaveBeenCalledWith(assistantMessage._id, 'negative');
    expect(store.updateMessageFeedback).toHaveBeenCalledWith(assistantMessage._id, 'negative');
  });

  it('sets fallback errors for failed write operations', () => {
    api.sendFirstMessage.mockReturnValue(throwError(() => ({ error: {} })));
    api.deleteChat.mockReturnValue(throwError(() => ({ error: {} })));
    api.submitFeedback.mockReturnValue(throwError(() => ({ error: {} })));

    service.sendFirstMessage('Hello');
    service.deleteChat(chat._id);
    service.submitFeedback(assistantMessage._id, 'positive');

    expect(store.setError).toHaveBeenCalledWith('Failed to send message');
    expect(store.setError).toHaveBeenCalledWith('Failed to delete chat');
    expect(store.setError).toHaveBeenCalledWith('Failed to submit feedback');
  });

  it('starts a new chat by clearing selection and messages', () => {
    service.newChat();

    expect(store.setSelectedChat).toHaveBeenCalledWith(null);
    expect(store.clearMessages).toHaveBeenCalled();
  });
});
