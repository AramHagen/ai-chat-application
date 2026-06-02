import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Chat,
  Message,
  SendMessageResponse,
  SendFirstMessageResponse,
} from '../../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  // GET /api/chats
  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`);
  }

  // DELETE /api/chats/:id
  deleteChat(chatId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/chats/${chatId}`);
  }

  // GET /api/chats/:chatId/messages
  getMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages`);
  }

  // POST /api/chats/messages (first message - creates chat)
  sendFirstMessage(content: string): Observable<SendFirstMessageResponse> {
    return this.http.post<SendFirstMessageResponse>(`${this.apiUrl}/chats/messages`, { content });
  }

  // POST /api/chats/:chatId/messages (existing chat)
  sendMessage(chatId: string, content: string): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(`${this.apiUrl}/chats/${chatId}/messages`, {
      content,
    });
  }

  // POST /api/messages/:messageId/feedback
  submitFeedback(
    messageId: string,
    feedback: 'positive' | 'negative',
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/messages/${messageId}/feedback`, {
      feedback,
    });
  }
}
