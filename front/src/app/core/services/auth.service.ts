import { Injectable, signal, computed } from '@angular/core';

interface User {
  id: string;
  email: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signals para el estado de autenticación
  private currentUser = signal<User | null>(null);
  private loading = signal(false);

  // Computed signals para acceso público de solo lectura
  isAuthenticated = computed(() => this.currentUser() !== null);
  isLoading = computed(() => this.loading());
  user = computed(() => this.currentUser());

  constructor() {
    // Verificar si hay una sesión guardada al iniciar
    this.checkStoredSession();
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loading.set(true);

    try {
      // Simulación de llamada API
      // En producción, reemplazar con tu endpoint real
      await this.simulateApiCall();

      // Validación simple para demo
      if (password.length >= 6) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0]
        };

        this.currentUser.set(user);

        // Guardar sesión en localStorage
        localStorage.setItem('auth_token', 'fake-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  private checkStoredSession(): void {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
      } catch (error) {
        console.error('Error al recuperar sesión:', error);
        this.logout();
      }
    }
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simula latencia de red
    });
  }
}
