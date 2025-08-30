import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Session } from '../../models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../models/clinic-config.model';

@Component({
  selector: 'app-new-session-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-session-dialog.component.html'
})
export class NewSessionDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() sessionCreated = new EventEmitter<Omit<Session, 'id' | 'created_at' | 'updated_at'>>();

  readonly clinicConfigs = CLINIC_CONFIGS;
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly sessionTypes = [
    'Terapia Individual',
    'Terapia de Pareja',
    'Terapia Familiar',
    'Terapia Grupal',
    'Evaluación Psicológica',
    'Consulta de Seguimiento'
  ];

  readonly sessionModes: Session['mode'][] = ['Presencial', 'Online'];
  readonly paymentMethods: Session['payment_method'][] = ['cash', 'card', 'transfer', 'bizum'];
  readonly paymentStatuses: Session['payment_status'][] = ['pending', 'paid', 'partial'];

  readonly formData = signal({
    patient_id: '',
    clinic_id: '',
    session_date: '',
    start_time: '',
    end_time: '',
    mode: 'Presencial' as Session['mode'],
    type: 'Terapia Individual',
    status: 'scheduled' as Session['status'],
    price: '',
    payment_method: 'cash' as Session['payment_method'],
    payment_status: 'pending' as Session['payment_status'],
    notes: ''
  });

  readonly patients = [
    { id: 101, name: 'Ana García' },
    { id: 102, name: 'Carlos López' },
    { id: 103, name: 'María Rodríguez' },
    { id: 104, name: 'Juan Martínez' },
    { id: 105, name: 'Laura Sánchez' },
    { id: 106, name: 'Pedro González' }
  ];

  constructor() {
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.formData.update(data => ({
      ...data,
      session_date: formattedDate
    }));
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onStartTimeChange(): void {
    const formData = this.formData();
    if (formData.start_time) {
      // Automatically set end time to 1 hour later
      const [hours, minutes] = formData.start_time.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours + 1, minutes, 0);
      const endTime = endDate.toTimeString().slice(0, 5);
      
      this.formData.update(data => ({
        ...data,
        end_time: endTime
      }));
    }
  }

  onSubmit(): void {
    const formData = this.formData();
    this.error.set(null);

    // Validation
    if (!formData.patient_id || !formData.clinic_id || !formData.session_date || 
        !formData.start_time || !formData.end_time || !formData.price) {
      this.error.set('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validate time
    if (formData.start_time >= formData.end_time) {
      this.error.set('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    // Validate price
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      this.error.set('Por favor, introduce un precio válido.');
      return;
    }

    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      const sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'> = {
        patient_id: parseInt(formData.patient_id),
        clinic_id: parseInt(formData.clinic_id),
        session_date: new Date(formData.session_date).toISOString(),
        start_time: formData.start_time + ':00',
        end_time: formData.end_time + ':00',
        mode: formData.mode,
        type: formData.type,
        status: formData.status,
        price: parseFloat(formData.price).toFixed(2),
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        notes: formData.notes || undefined
      };

      this.sessionCreated.emit(sessionData);
      this.isLoading.set(false);
    }, 1000);
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? patient.name : `Paciente ${patientId}`;
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

  getPaymentStatusText(status: Session['payment_status']): string {
    const paymentStatusTexts = {
      pending: 'Pendiente',
      paid: 'Pagado',
      partial: 'Parcial'
    };
    return paymentStatusTexts[status] || status;
  }

  updatePatientId(value: string): void {
    this.formData.update(data => ({ ...data, patient_id: value }));
  }

  updateClinicId(value: string): void {
    this.formData.update(data => ({ ...data, clinic_id: value }));
  }

  updateSessionDate(value: string): void {
    this.formData.update(data => ({ ...data, session_date: value }));
  }

  updateStartTime(value: string): void {
    this.formData.update(data => ({ ...data, start_time: value }));
    this.onStartTimeChange();
  }

  updateEndTime(value: string): void {
    this.formData.update(data => ({ ...data, end_time: value }));
  }

  updateSessionType(value: string): void {
    this.formData.update(data => ({ ...data, type: value }));
  }

  updateMode(value: Session['mode']): void {
    this.formData.update(data => ({ ...data, mode: value }));
  }

  updatePrice(value: string): void {
    this.formData.update(data => ({ ...data, price: value }));
  }

  updatePaymentMethod(value: Session['payment_method']): void {
    this.formData.update(data => ({ ...data, payment_method: value }));
  }

  updatePaymentStatus(value: Session['payment_status']): void {
    this.formData.update(data => ({ ...data, payment_status: value }));
  }

  updateNotes(value: string): void {
    this.formData.update(data => ({ ...data, notes: value }));
  }
}