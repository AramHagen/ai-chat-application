import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-header',
  imports: [CommonModule],
  templateUrl: './chat-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center justify-between'
  }
})
export class ChatHeader {
  title = input('Chat with AI');
  avatar = input('https://api.dicebear.com/7.x/avataaars/svg?seed=AI');

  onSettings() {
    console.log('Settings clicked');
  }
}
