import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import {
  Chat,
  Message,
  SendFirstMessageResponse,
  SendMessageResponse,
} from '../../models/chat.model';
import { ChatApiService } from './chat-api.service';

describe('ChatApiService', () => {
  let service: ChatApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiBaseUrl;

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
    TestBed.configureTestingModule({
      providers: [ChatApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ChatApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets all chats', () => {
    service.getChats().subscribe((response) => {
      expect(response).toEqual([chat]);
    });

    const request = httpMock.expectOne(`${apiUrl}/chats`);
    expect(request.request.method).toBe('GET');
    request.flush([chat]);
  });

  it('deletes a chat', () => {
    service.deleteChat(chat._id).subscribe((response) => {
      expect(response).toEqual({ message: 'Deleted' });
    });

    const request = httpMock.expectOne(`${apiUrl}/chats/${chat._id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'Deleted' });
  });

  it('gets messages for a chat', () => {
    service.getMessages(chat._id).subscribe((response) => {
      expect(response).toEqual([userMessage, assistantMessage]);
    });

    const request = httpMock.expectOne(`${apiUrl}/chats/${chat._id}/messages`);
    expect(request.request.method).toBe('GET');
    request.flush([userMessage, assistantMessage]);
  });

  it('sends a first message', () => {
    const response: SendFirstMessageResponse = {
      chat,
      userMessage,
      assistantMessage,
    };

    service.sendFirstMessage('Hello').subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = httpMock.expectOne(`${apiUrl}/chats/messages`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ content: 'Hello' });
    request.flush(response);
  });

  it('sends a message to an existing chat', () => {
    const response: SendMessageResponse = {
      userMessage,
      assistantMessage,
    };

    service.sendMessage(chat._id, 'Hello again').subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = httpMock.expectOne(`${apiUrl}/chats/${chat._id}/messages`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ content: 'Hello again' });
    request.flush(response);
  });

  it('submits feedback for a message', () => {
    service.submitFeedback(assistantMessage._id, 'positive').subscribe((response) => {
      expect(response).toEqual({ message: 'Feedback submitted' });
    });

    const request = httpMock.expectOne(`${apiUrl}/messages/${assistantMessage._id}/feedback`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ feedback: 'positive' });
    request.flush({ message: 'Feedback submitted' });
  });
});
