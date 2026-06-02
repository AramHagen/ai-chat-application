import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacadeService } from '../services/auth/auth-facade.service';

export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  if (authFacade.isLoggedIn()()) {
    return true;
  }

  router.navigate(['/signin']);
  return false;
};
