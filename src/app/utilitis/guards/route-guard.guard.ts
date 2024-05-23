import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { BackendService } from '../services/backend.service';
import { UserService } from '../services/user.service';

export const routeGuardGuard: CanActivateFn = async (route, state) => {
  const userBackend = inject(UserService);
  const user = userBackend.getUser();
  const isLoggedIn = userBackend.isLoggedIn();
  const isAdmin = !(user?.role === 'admin');
  const router = inject(Router);

  if (state.url.startsWith('/admin') && isLoggedIn) {
    if (!isAdmin && isLoggedIn) {
      router.navigate(['/admin/allUsers']);
      return false;
    }
    return true;
  }
  if (!isAdmin) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
