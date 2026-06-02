import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInputComponent {
  message = signal('');
  showEmojiPicker = signal(false);
  emojis = ['😀', '😂', '😍', '👍', '🙏', '🔥', '🎉', '💡'];
  messageSent = output<string>();

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.message.set(target.value);
  }

  onSend() {
    if (this.message().trim()) {
      this.messageSent.emit(this.message());
      this.message.set('');
      this.showEmojiPicker.set(false);
    }
  }

  onEmojiButtonClick() {
    this.showEmojiPicker.update((isOpen) => !isOpen);
  }

  onEmojiSelect(emoji: string) {
    this.message.update((message) => `${message}${emoji}`);
    this.showEmojiPicker.set(false);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}
