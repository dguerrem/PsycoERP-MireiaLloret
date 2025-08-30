import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from '../../models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../models/clinic-config.model';

@Component({
  selector: 'app-session-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-popup.component.html'
})
export class SessionPopupComponent {
  @Input({ required: true }) session!: Session;
  @Output() close = new EventEmitter<void>();

  readonly clinicConfigs = CLINIC_CONFIGS;

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getClinicConfig(clinicId: number): ClinicConfig {
    return this.clinicConfigs.find(config => config.id === clinicId) || this.clinicConfigs[0];
  }

  getPatientName(patientId: number): string {
    const patientNames: { [key: number]: string } = {
      101: 'Ana García',
      102: 'Carlos López',
      103: 'María Rodríguez',
      104: 'Juan Martínez',
      105: 'Laura Sánchez',
      106: 'Pedro González'
    };
    return patientNames[patientId] || `Paciente ${patientId}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getStatusText(status: Session['status']): string {
    const statusTexts = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No asistió'
    };
    return statusTexts[status] || status;
  }

  getStatusBadgeClass(status: Session['status']): string {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || statusClasses.scheduled;
  }

  getPaymentStatusText(status: Session['payment_status']): string {
    const paymentStatusTexts = {
      pending: 'Pendiente',
      paid: 'Pagado',
      partial: 'Parcial'
    };
    return paymentStatusTexts[status] || status;
  }

  getPaymentStatusBadgeClass(status: Session['payment_status']): string {
    const paymentStatusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-orange-100 text-orange-800'
    };
    return paymentStatusClasses[status] || paymentStatusClasses.pending;
  }

  getPaymentMethodText(method: Session['payment_method']): string {
    const paymentMethodTexts = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      bizum: 'Bizum'
    };
    return paymentMethodTexts[method] || method;
  }
}