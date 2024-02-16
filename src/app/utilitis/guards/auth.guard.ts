import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(FirebaseAuthService).isLoggedIn();
  const router = inject(Router);
  if (
    state.url === '/login' ||
    state.url === '/register' ||
    route.component === LoginComponent
  ) {
    if (isLoggedIn) {
      router.navigate(['/dashboard']);
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
