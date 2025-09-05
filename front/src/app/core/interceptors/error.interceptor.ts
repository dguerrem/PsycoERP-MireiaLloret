import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log del error para desarrollo
      console.error('HTTP Error:', error);

      let errorMessage = 'Ha ocurrido un error';
      let shouldShowToast = true;

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error de conexión: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 0:
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Datos inválidos. Revisa la información enviada';
            break;
          case 401:
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            // Aquí se podría redirigir al login
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción';
            break;
          case 404:
            errorMessage = error.error?.message || 'Recurso no encontrado';
            break;
          case 409:
            errorMessage = error.error?.message || 'El recurso ya existe';
            break;
          case 422:
            errorMessage = error.error?.message || 'Los datos proporcionados no son válidos';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          case 503:
            errorMessage = 'Servicio no disponible. Inténtalo más tarde';
            break;
          default:
            if (error.status >= 500) {
              errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
            } else {
              errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
            }
        }
      }

      if (shouldShowToast) {
        toast.showError(errorMessage);
      }

      // Re-lanzar el error con el mensaje procesado
      return throwError(() => ({ ...error, processedMessage: errorMessage }));
    })
  );
};