import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Cualquier usuario con sesión (USER o SUPER-ADMIN-ROLE)
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaVigente()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
};

// Solo SUPER-ADMIN-ROLE
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.estaVigente()) {
    return router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
  }
  return auth.esAdmin() ? true : router.createUrlTree(['/no-autorizado']);
};

// Login y registro: si ya hay sesión, no tiene sentido verlos
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaVigente() ? router.createUrlTree(['/productos']) : true;
};
