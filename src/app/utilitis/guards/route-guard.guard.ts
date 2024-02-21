import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { Observable, map } from 'rxjs';

export const routeGuardGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const router = inject(Router);
  const authService = inject(FirebaseAuthService);
  return authService.isAdmin$.pipe(
    map((isAdmin) => {
      console.log(isAdmin);

      if (!isAdmin) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    })
  );
};
