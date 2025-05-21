import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export function RoleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    const isLoggedIn = auth.isAuthenticated();
    const userRole = auth.getUserRole();

    if (!isLoggedIn) {
      snackBar.open('Vous devez être connecté(e)', 'Fermer', { duration: 3000 });
      router.navigate(['/']);
      return false;
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
        snackBar.open('Accès refusé : utilisateur non autorisé', 'Fermer', { duration: 3000 });
        router.navigate(['/']);
      return false;
  }



    return true;
  };
}
