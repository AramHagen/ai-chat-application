import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacadeService } from './services/auth/auth-facade.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  private authFacade = inject(AuthFacadeService);

  ngOnInit(): void {
    this.authFacade.initAuth();
  }
}
