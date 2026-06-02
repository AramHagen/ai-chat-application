import { Component, ChangeDetectionStrategy, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, FormsModule],
  templateUrl: './signin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  private authFacade = inject(AuthFacadeService);

  email = '';
  password = '';

  loading: Signal<boolean> = this.authFacade.isLoading();
  error: Signal<string | null> = this.authFacade.getError();

  onSignin() {
    this.authFacade.signin(this.email, this.password);
  }

  goToSignup() {
    this.authFacade.navigateToSignup();
  }
}
