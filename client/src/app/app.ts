import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { ChatHeader } from './components/chat-header/chat-header';
import { MessageList } from './components/message-list/message-list';
import { ChatInput } from './components/chat-input/chat-input';
import { SubscribeBadge } from './components/subscribe-badge/subscribe-badge';

@Component({
  selector: 'app-root',
  imports: [Sidebar, ChatHeader, MessageList, ChatInput, SubscribeBadge],
  templateUrl: './app.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-screen w-screen'
  }
})
export class App {
  protected readonly title = signal('chat-frontend');

  onMessageSent(message: string) {
    console.log('Message sent:', message);
    // Will integrate with API later
  }
}
