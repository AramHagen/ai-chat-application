import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../types/chat.types';

@Component({
  selector: 'app-message-item',
  imports: [CommonModule],
  templateUrl: './message-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class MessageItem {
  message = input.required<Message>();
  isLast = input(false);
  feedbackGiven = output<'positive' | 'negative'>();

  onFeedback(type: 'positive' | 'negative') {
    this.feedbackGiven.emit(type);
    console.log('Feedback:', type);
  }
}
