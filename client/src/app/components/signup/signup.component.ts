import { Component, ChangeDetectionStrategy, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthFacadeService } from '../../services/auth/auth-facade.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private authFacade = inject(AuthFacadeService);

  name = '';
  email = '';
  password = '';

  loading: Signal<boolean> = this.authFacade.isLoading();
  error: Signal<string | null> = this.authFacade.getError();

  onSignup() {
    this.authFacade.signup(this.name, this.email, this.password);
  }

  goToSignin() {
    this.authFacade.navigateToSignin();
  }
}
