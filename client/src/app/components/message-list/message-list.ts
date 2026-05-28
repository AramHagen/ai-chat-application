import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../types/chat.types';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, MessageItem],
  templateUrl: './message-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-1 overflow-y-auto'
  }
})
export class MessageList {
  messages = signal<Message[]>([
    {
      id: '1',
      content: 'Create a chatbot api using python language what will be step for that',
      sender: 'user',
      timestamp: new Date(Date.now() - 60000),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
    },
    {
      id: '2',
      content: 'Sure, I can help you get started with creating a chatbot using GPT in Python. Here are the basic steps you\'ll need to follow:',
      sender: 'ai',
      timestamp: new Date(Date.now() - 50000),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI'
    },
  ]);

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  isLastAIMessage(index: number): boolean {
    const msgs = this.messages();
    if (index !== msgs.length - 1) return false;
    return msgs[index].sender === 'ai';
  }

  onMessageFeedback(feedback: 'positive' | 'negative', messageId: string) {
    console.log(`Message ${messageId} feedback: ${feedback}`);
    // Will integrate with API later
  }
}
