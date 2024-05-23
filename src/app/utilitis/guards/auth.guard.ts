import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { FirebaseAuthService } from '../services/firebase-auth.service';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  // const authService = inject(FirebaseAuthService);
  const isLoggedIn = userService.isLoggedIn();
  const router = inject(Router);
  if (
    state.url === '/login' ||
    state.url === '/register' ||
    route.component === LoginComponent
  ) {
    if (isLoggedIn) {
      console.log(isLoggedIn);

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
