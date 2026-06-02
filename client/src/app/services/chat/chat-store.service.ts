import { Injectable, signal, computed } from '@angular/core';
import { Chat, Message } from '../../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatStoreService {
  // ── Signals (private state) ──
  private _chats = signal<Chat[]>([]);
  private _selectedChat = signal<Chat | null>(null);
  private _messages = signal<Message[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // ── Getters (public read-only) ──
  readonly chats = computed(() => this._chats());
  readonly selectedChat = computed(() => this._selectedChat());
  readonly messages = computed(() => this._messages());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  // ── Setters ──
  setChats(chats: Chat[]): void {
    this._chats.set(chats);
  }

  setSelectedChat(chat: Chat | null): void {
    this._selectedChat.set(chat);
  }

  setMessages(messages: Message[]): void {
    this._messages.set(messages);
  }

  addMessage(message: Message): void {
    this._messages.update((msgs) => [...msgs, message]);
  }

  addChat(chat: Chat): void {
    this._chats.update((chats) => [chat, ...chats]);
  }

  removeChat(chatId: string): void {
    this._chats.update((chats) => chats.filter((c) => c._id !== chatId));
    if (this._selectedChat()?._id === chatId) {
      this._selectedChat.set(null);
      this._messages.set([]);
    }
  }

  updateMessageFeedback(messageId: string, feedback: 'positive' | 'negative'): void {
    this._messages.update((msgs) =>
      msgs.map((m) => (m._id === messageId ? { ...m, feedback } : m)),
    );
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearMessages(): void {
    this._messages.set([]);
  }
}
