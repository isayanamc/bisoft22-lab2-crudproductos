import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';
import { API_URL } from '../utils/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const esApi = req.url.startsWith(API_URL);
  const esAuth = req.url.startsWith(`${API_URL}/auth/`); // login y registro no llevan token
  const token = auth.tokenActual();

  // Solo a nuestra API, nunca a login/registro, y solo si hay token vigente
  const peticion =
    esApi && !esAuth && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(peticion).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && esApi && !esAuth) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
