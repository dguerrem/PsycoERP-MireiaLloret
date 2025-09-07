import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Solo modificar URLs que no sean completas (no empiecen con http)
  if (!req.url.startsWith('http')) {
    // Construir URL completa
    const apiUrl = `${environment.api.baseUrl}${req.url}`;
    
    // Clonar request con nueva URL y headers
    const modifiedReq = req.clone({
      url: apiUrl,
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Preparado para futuro token de auth
        // 'Authorization': `Bearer ${token}`
      }
    });

    return next(modifiedReq);
  }

  // Si ya es una URL completa, solo agregar headers básicos
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(modifiedReq);
};