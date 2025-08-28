import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  email = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  updateEmail(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }

  updatePassword(event: Event) {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.error.set('');

    if (!this.email() || !this.password()) {
      this.error.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    try {
      const success = await this.authService.login(this.email(), this.password());
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Credenciales inválidas. La contraseña debe tener al menos 6 caracteres.');
      }
    } catch (err) {
      this.error.set('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
