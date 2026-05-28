export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  avatar?: string;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview?: string;
}
