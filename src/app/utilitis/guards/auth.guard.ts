import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(FirebaseAuthService).isLoggedIn();
  const router = inject(Router);
  if (state.url === '/login' || state.url === '/register') {
    if (isLoggedIn) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
