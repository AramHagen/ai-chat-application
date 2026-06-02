import { Component, input, output, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import { Message } from '../../models/chat.model';

@Component({
  selector: 'app-message-item',
  imports: [CommonModule],
  templateUrl: './message-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class MessageItemComponent {
  private sanitizer = inject(DomSanitizer);

  message = input.required<Message>();
  isLast = input(false);
  feedbackGiven = output<'positive' | 'negative'>();

  renderedContent = computed(() => {
    const html = marked.parse(this.message().content) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  onFeedback(type: 'positive' | 'negative') {
    this.feedbackGiven.emit(type);
  }
}
