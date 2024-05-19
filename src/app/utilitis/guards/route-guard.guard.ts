import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
// import { Firestore, firestoreInstance$ } from '@angular/fire/firestore';
import { HomepageComponent } from 'src/app/pages/homepage/homepage.component';

export const routeGuardGuard: CanActivateFn = async (route, state) => {
  const isLoggedIn = inject(FirebaseAuthService).isLoggedIn();
  const isAdmin = inject(FirebaseAuthService).getUser();
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
