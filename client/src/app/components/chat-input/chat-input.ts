import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'border-t border-gray-200 p-4'
  }
})
export class ChatInput {
  message = signal('');
  messageSent = output<string>();

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.message.set(target.value);
  }

  onSend() {
    if (this.message().trim()) {
      this.messageSent.emit(this.message());
      this.message.set('');
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}
