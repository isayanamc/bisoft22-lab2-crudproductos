import { HttpErrorResponse } from '@angular/common/http';

// Convertir un error HTTP en un mensaje para mostrar en pantalla
export function mensajeDeError(error: unknown): string {
  // Si no es un error HTTP, no sabemos qué pasó
  if (!(error instanceof HttpErrorResponse)) {
    return 'Ocurrió un error inesperado';
  }

  // status 0: la petición ni siquiera llegó (API apagada o sin conexión)
  if (error.status === 0) {
    return 'No se pudo conectar con la API. ¿Está corriendo en localhost:8080?';
  }

  // 403: el token es válido pero el rol no tiene permiso (@PreAuthorize)
  if (error.status === 403) {
    return 'No tiene permiso para realizar esta acción';
  }

  // El body que mandó la API
  const cuerpo = error.error as { detail?: string; errores?: Record<string, string> } | null;

  // 400 de validación
  if (cuerpo?.errores) {
    return Object.values(cuerpo.errores).join('. ');
  }

  // 404, 409
  return cuerpo?.detail ?? `Error ${error.status}`;
}
