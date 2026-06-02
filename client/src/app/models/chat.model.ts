export interface Chat {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  feedback: 'positive' | 'negative' | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}

export interface SendFirstMessageResponse {
  chat: Chat;
  userMessage: Message;
  assistantMessage: Message;
}
