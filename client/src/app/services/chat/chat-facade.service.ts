import { Injectable, Signal } from '@angular/core';
import { ChatApiService } from './chat-api.service';
import { ChatStoreService } from './chat-store.service';
import { Chat, Message } from '../../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatFacadeService {
  constructor(
    private api: ChatApiService,
    private store: ChatStoreService,
  ) {}

  // ── Getters (components read state from here) ──

  getChats(): Signal<Chat[]> {
    return this.store.chats;
  }

  getSelectedChat(): Signal<Chat | null> {
    return this.store.selectedChat;
  }

  getMessages(): Signal<Message[]> {
    return this.store.messages;
  }

  isLoading(): Signal<boolean> {
    return this.store.loading;
  }

  getError(): Signal<string | null> {
    return this.store.error;
  }

  // ── Actions (components call these to trigger API + update store) ──

  // Load all chats
  loadChats(): void {
    this.store.setLoading(true);
    this.api.getChats().subscribe({
      next: (chats) => {
        this.store.setChats(chats);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Failed to load chats');
        this.store.setLoading(false);
      },
    });
  }

  // Select a chat and load its messages
  selectChat(chat: Chat): void {
    this.store.setSelectedChat(chat);
    this.store.clearMessages();
    this.store.setLoading(true);
    this.api.getMessages(chat._id).subscribe({
      next: (messages) => {
        this.store.setMessages(messages);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Failed to load messages');
        this.store.setLoading(false);
      },
    });
  }

  // Send first message — creates a new chat
  sendFirstMessage(content: string): void {
    this.store.setLoading(true);
    this.api.sendFirstMessage(content).subscribe({
      next: (response) => {
        this.store.addChat(response.chat);
        this.store.setSelectedChat(response.chat);
        this.store.setMessages([response.userMessage, response.assistantMessage]);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Failed to send message');
        this.store.setLoading(false);
      },
    });
  }

  // Send message to existing chat
  sendMessage(content: string): void {
    const selectedChat = this.store.selectedChat();
    if (!selectedChat) return;

    this.store.setLoading(true);
    this.api.sendMessage(selectedChat._id, content).subscribe({
      next: (response) => {
        this.store.addMessage(response.userMessage);
        this.store.addMessage(response.assistantMessage);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Failed to send message');
        this.store.setLoading(false);
      },
    });
  }

  // Delete a chat
  deleteChat(chatId: string): void {
    this.api.deleteChat(chatId).subscribe({
      next: () => {
        this.store.removeChat(chatId);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Failed to delete chat');
      },
    });
  }

  // Submit feedback on a message
  submitFeedback(messageId: string, feedback: 'positive' | 'negative'): void {
    this.api.submitFeedback(messageId, feedback).subscribe({
      next: () => {
        this.store.updateMessageFeedback(messageId, feedback);
      },
      error: (err) => {
        this.store.setError(err.error?.message || 'Failed to submit feedback');
      },
    });
  }

  // Start a new chat (clear selection)
  newChat(): void {
    this.store.setSelectedChat(null);
    this.store.clearMessages();
  }
}
