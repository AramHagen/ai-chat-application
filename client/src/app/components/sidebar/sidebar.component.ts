import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full',
  },
})
export class SidebarComponent {
  chats = input<Chat[]>([]);
  selectedChatId = input<string | null>(null);
  userName = input('User');

  newChat = output<void>();
  selectChat = output<Chat>();
  deleteChat = output<string>();

  onNewChat() {
    this.newChat.emit();
  }

  onSelectChat(chat: Chat) {
    this.selectChat.emit(chat);
  }

  onDeleteChat(event: Event, chatId: string) {
    event.stopPropagation();
    this.deleteChat.emit(chatId);
  }

  displayUserName(): string {
    return this.userName().trim() || 'User';
  }

  userInitial(): string {
    return this.displayUserName().charAt(0).toUpperCase();
  }
}
