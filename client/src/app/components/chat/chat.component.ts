import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatFacadeService } from '../../services/chat/chat-facade.service';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';
import { Chat, Message } from '../../models/chat.model';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-chat',
  imports: [SidebarComponent, ChatHeaderComponent, MessageListComponent, ChatInputComponent],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-screen w-screen',
  },
})
export class ChatComponent {
  private chatFacade = inject(ChatFacadeService);
  private authFacade = inject(AuthFacadeService);

  // Signals from facade
  chats: Signal<Chat[]> = this.chatFacade.getChats();
  messages: Signal<Message[]> = this.chatFacade.getMessages();
  selectedChat: Signal<Chat | null> = this.chatFacade.getSelectedChat();
  loading: Signal<boolean> = this.chatFacade.isLoading();
  currentUser: Signal<User | null> = this.authFacade.getUser();

  ngOnInit(): void {
    this.chatFacade.loadChats();
  }

  onMessageSent(content: string) {
    const selected = this.selectedChat();
    if (selected) {
      this.chatFacade.sendMessage(content);
    } else {
      this.chatFacade.sendFirstMessage(content);
    }
  }

  onSelectChat(chat: Chat) {
    this.chatFacade.selectChat(chat);
  }

  onDeleteChat(chatId: string) {
    this.chatFacade.deleteChat(chatId);
  }

  onNewChat() {
    this.chatFacade.newChat();
  }

  onFeedback(event: { messageId: string; feedback: 'positive' | 'negative' }) {
    this.chatFacade.submitFeedback(event.messageId, event.feedback);
  }
}
