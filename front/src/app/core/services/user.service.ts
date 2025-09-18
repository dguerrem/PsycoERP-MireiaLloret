import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { tap, finalize, map } from 'rxjs/operators';
import { User, UserProfileResponse, UpdateUserProfileRequest } from '../models/user.model';
import { ToastService } from './toast.service';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);

  // Signals para el estado del perfil de usuario
  private userProfile = signal<User | null>(null);
  private loading = signal(false);
  private updating = signal(false);

  // Computed signals para acceso público de solo lectura
  profile = computed(() => this.userProfile());
  isLoading = computed(() => this.loading());
  isUpdating = computed(() => this.updating());

  /**
   * Obtiene el perfil del usuario por ID
   */
  getUserProfile(id: number): Observable<User> {
    this.loading.set(true);

    return this.http.get<UserProfileResponse>(`/users/${id}`).pipe(
      tap((response: UserProfileResponse) => {
        this.userProfile.set(response.data);
      }),
      map((response: UserProfileResponse) => response.data),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Obtiene el perfil del usuario por ID (versión async)
   */
  async getUserProfileAsync(id: number): Promise<User | null> {
    try {
      const response = await lastValueFrom(this.getUserProfile(id));
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  updateUserProfile(id: number, userData: UpdateUserProfileRequest): Observable<User> {
    this.updating.set(true);

    return this.http.put<UserProfileResponse>(`/users/${id}`, userData).pipe(
      tap((response: UserProfileResponse) => {
        this.userProfile.set(response.data);
        this.toast.showSuccess('Perfil actualizado correctamente');
      }),
      map((response: UserProfileResponse) => response.data),
      finalize(() => this.updating.set(false))
    );
  }

  /**
   * Actualiza el perfil del usuario (versión async)
   */
  async updateUserProfileAsync(id: number, userData: UpdateUserProfileRequest): Promise<User | null> {
    try {
      const response = await lastValueFrom(this.updateUserProfile(id, userData));
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  /**
   * Limpia el estado del perfil (útil para logout)
   */
  clearProfile(): void {
    this.userProfile.set(null);
  }

  /**
   * Establece el perfil del usuario (útil para sincronizar con AuthService)
   */
  setProfile(user: User): void {
    this.userProfile.set(user);
  }

  /**
   * Obtiene el ID del usuario desde localStorage
   */
  getUserIdFromStorage(): number | null {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    // También intentar obtenerlo desde el objeto user almacenado
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          return user.id ? parseInt(user.id.toString()) : null;
        } catch {
          return null;
        }
      }
    }

    return userId ? parseInt(userId) : null;
  }
}
