import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/chat.model';
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule, MessageItemComponent],
  templateUrl: './message-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-1 overflow-y-auto',
  },
})
export class MessageListComponent {
  messages = input<Message[]>([]);
  loading = input<boolean>(false);
  feedbackGiven = output<{ messageId: string; feedback: 'positive' | 'negative' }>();

  trackByMessageId(index: number, message: Message): string {
    return message._id;
  }

  isLastAIMessage(index: number): boolean {
    const msgs = this.messages();
    if (index !== msgs.length - 1) return false;
    return msgs[index].role === 'assistant';
  }

  onFeedback(feedback: 'positive' | 'negative', messageId: string) {
    this.feedbackGiven.emit({ messageId, feedback });
  }
}
