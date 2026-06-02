import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthFacadeService } from './services/auth/auth-facade.service';

const homeRedirect = () => {
  const authFacade = inject(AuthFacadeService);
  return authFacade.isLoggedIn()() ? '/chat' : '/signin';
};

export const routes: Routes = [
  { path: '', redirectTo: homeRedirect, pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat.component').then((m) => m.ChatComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/signin' },
];
