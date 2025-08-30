import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionData, SessionUtils } from '../../models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../models/clinic-config.model';

@Component({
  selector: 'app-session-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-popup.component.html'
})
export class SessionPopupComponent {
  @Input({ required: true }) sessionData!: SessionData;
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

  getClinicConfigFromSessionData(): ClinicConfig {
    return this.getClinicConfig(this.sessionData.SessionDetailData.ClinicDetailData.clinic_id);
  }

  getPatientName(): string {
    return this.sessionData.SessionDetailData.PatientData.name;
  }

  getClinicName(): string {
    return this.sessionData.SessionDetailData.ClinicDetailData.clinic_name;
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

  getStatusText(): string {
    return SessionUtils.getStatusText(this.sessionData);
  }

  getStatusBadgeClass(): string {
    return SessionUtils.getStatusBadgeClass(this.sessionData);
  }

  getPaymentStatusText(): string {
    return SessionUtils.formatPaymentStatus(this.sessionData.SessionDetailData.payment_status);
  }

  getPaymentStatusBadgeClass(): string {
    const status = this.sessionData.SessionDetailData.payment_status;
    const paymentStatusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-orange-100 text-orange-800'
    };
    return paymentStatusClasses[status as keyof typeof paymentStatusClasses] || paymentStatusClasses.pending;
  }

  getPaymentMethodText(): string {
    return SessionUtils.formatPaymentMethod(this.sessionData.SessionDetailData.payment_method);
  }

  formatPrice(): string {
    return SessionUtils.formatPrice(this.sessionData.SessionDetailData.price);
  }

  getMedicalRecords(): Array<{title: string, content: string, date: string}> {
    return this.sessionData.SessionDetailData.MedicalRecordData || [];
  }

  formatMedicalRecordDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  hasNotes(): boolean {
    return !!this.sessionData.SessionDetailData.notes;
  }

  hasMedicalRecords(): boolean {
    return this.getMedicalRecords().length > 0;
  }
}