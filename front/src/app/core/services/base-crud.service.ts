import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
}

export interface ApiItemResponse<T> {
  data: T;
}

@Injectable()
export abstract class BaseCrudService<T> {
  protected http = inject(HttpClient);
  protected toast = inject(ToastService);

  protected readonly endpoint: string;
  protected readonly entityName: string;

  constructor(endpoint: string, entityName?: string) {
    this.endpoint = endpoint;
    this.entityName = entityName || endpoint.replace('/', '').slice(0, -1); // Remove '/' and last 's'
  }

  protected get apiUrl(): string {
    return this.endpoint;
  }

  protected get httpOptions() {
    return {
      // Headers básicos - el interceptor agregará los demás automáticamente
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      responseType: 'json' as const
    };
  }

  getAll(): Observable<T[]> {
    return this.http.get<ApiListResponse<T>>(this.apiUrl, {
      ...this.httpOptions
    }).pipe(
      map((response: ApiListResponse<T>) => response.data)
      // Error handling ahora manejado por errorInterceptor
    );
  }

  getById(id: string | number): Observable<T> {
    return this.http.get<ApiItemResponse<T>>(`${this.apiUrl}/${id}`, {
      ...this.httpOptions
    }).pipe(
      map((response: ApiItemResponse<T>) => response.data)
      // Error handling ahora manejado por errorInterceptor
    );
  }

  create(item: Partial<T>): Observable<T> {
    return this.http.post<ApiItemResponse<T>>(this.apiUrl, item, {
      ...this.httpOptions
    }).pipe(
      map((response: ApiItemResponse<T>) => {
        this.toast.showSuccess(`${this.entityName} creado correctamente`);
        return response.data;
      })
      // Error handling ahora manejado por errorInterceptor
    );
  }

  update(id: string | number, item: Partial<T>): Observable<T> {
    return this.http.put<ApiItemResponse<T>>(`${this.apiUrl}/${id}`, item, {
      ...this.httpOptions
    }).pipe(
      map((response: ApiItemResponse<T>) => {
        this.toast.showSuccess(`${this.entityName} actualizado correctamente`);
        return response.data;
      })
      // Error handling ahora manejado por errorInterceptor
    );
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      ...this.httpOptions,
      responseType: 'json' as const
    }).pipe(
      tap(() => {
        this.toast.showSuccess(`${this.entityName} eliminado correctamente`);
      })
      // Error handling ahora manejado por errorInterceptor
    );
  }


  // Método helper para extraer datos de respuestas de API
   extractData<R>(response: ApiListResponse<R> | ApiItemResponse<R>): R | R[] {
    return response.data;
  }

  // Método para operaciones personalizadas con manejo de errores automático
  protected performRequest<R>(
    request: Observable<R>,
    successMessage?: string
  ): Observable<R> {
    return request.pipe(
      tap(() => {
        if (successMessage) {
          this.toast.showSuccess(successMessage);
        }
      })
      // Error handling ahora manejado por errorInterceptor
    );
  }
}
