import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';

@Component({
  selector: 'app-chat-header',
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center justify-between',
  },
})
export class ChatHeaderComponent {
  title = input('Chat with AI');
  avatar = input('https://api.dicebear.com/7.x/avataaars/svg?seed=AI');

  private authFacade = inject(AuthFacadeService);

  onSignOut() {
    this.authFacade.logout();
  }
}
