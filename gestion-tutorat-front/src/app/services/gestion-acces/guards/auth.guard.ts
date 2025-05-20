import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const isLoggedIn = auth.isAuthenticated();

  if (!isLoggedIn) {
    snackBar.open('Vous devez être connecté(e)', 'Fermer', { duration: 3000 });
    router.navigate(['/']);
    return false;
  }

  return true;
};
