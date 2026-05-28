import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscribe-badge',
  imports: [CommonModule],
  templateUrl: './subscribe-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hidden md:flex'
  }
})
export class SubscribeBadge {
  onSubscribe() {
    console.log('Subscribe clicked');
  }
}
