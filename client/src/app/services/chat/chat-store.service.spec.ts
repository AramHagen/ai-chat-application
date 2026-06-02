import { Chat, Message } from '../../models/chat.model';
import { ChatStoreService } from './chat-store.service';

describe('ChatStoreService', () => {
  let service: ChatStoreService;

  const chat: Chat = {
    _id: 'chat-1',
    userId: 'user-1',
    title: 'First chat',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  const secondChat: Chat = {
    ...chat,
    _id: 'chat-2',
    title: 'Second chat',
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

  beforeEach(() => {
    service = new ChatStoreService();
  });

  it('sets chat, selected chat, messages, loading, and error state', () => {
    service.setChats([chat]);
    service.setSelectedChat(chat);
    service.setMessages([message]);
    service.setLoading(true);
    service.setError('Failed');

    expect(service.chats()).toEqual([chat]);
    expect(service.selectedChat()).toEqual(chat);
    expect(service.messages()).toEqual([message]);
    expect(service.loading()).toBe(true);
    expect(service.error()).toBe('Failed');
  });

  it('adds new chats to the front and appends messages', () => {
    service.setChats([chat]);
    service.addChat(secondChat);
    service.addMessage(message);

    expect(service.chats()).toEqual([secondChat, chat]);
    expect(service.messages()).toEqual([message]);
  });

  it('removes a chat and clears the selection when removing the selected chat', () => {
    service.setChats([chat, secondChat]);
    service.setSelectedChat(chat);
    service.setMessages([message]);

    service.removeChat(chat._id);

    expect(service.chats()).toEqual([secondChat]);
    expect(service.selectedChat()).toBeNull();
    expect(service.messages()).toEqual([]);
  });

  it('keeps messages when removing an unselected chat', () => {
    service.setChats([chat, secondChat]);
    service.setSelectedChat(chat);
    service.setMessages([message]);

    service.removeChat(secondChat._id);

    expect(service.chats()).toEqual([chat]);
    expect(service.selectedChat()).toEqual(chat);
    expect(service.messages()).toEqual([message]);
  });

  it('updates message feedback and clears messages', () => {
    service.setMessages([message]);

    service.updateMessageFeedback(message._id, 'positive');

    expect(service.messages()[0].feedback).toBe('positive');

    service.clearMessages();

    expect(service.messages()).toEqual([]);
  });
});
