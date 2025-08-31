import { Component, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionData } from '../../models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../models/clinic-config.model';

/**
 * Modal dialog component for creating new session appointments
 * 
 * Features:
 * - Reactive forms with validation
 * - Custom dropdowns matching React UI
 * - Real-time form updates with signals
 * - Responsive design with Tailwind CSS
 * 
 * @example
 * ```html
 * <app-new-session-dialog 
 *   (close)="onCloseDialog()"
 *   (sessionDataCreated)="onSessionCreated($event)">
 * </app-new-session-dialog>
 * ```
 */
@Component({
  selector: 'app-new-session-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-session-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSessionDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() sessionDataCreated = new EventEmitter<Omit<SessionData['SessionDetailData'], 'session_id' | 'created_at' | 'updated_at'>>();

  /** Clinic configurations for dropdown options */
  readonly clinicConfigs = CLINIC_CONFIGS;
  
  /** Loading state signal */
  readonly isLoading = signal(false);
  
  /** Error message signal */
  readonly error = signal<string | null>(null);

  /** Dropdown states for custom select components */
  readonly dropdownStates = signal({
    patient: false,
    clinic: false,
    type: false,
    payment: false,
    modality: false
  });

  /** Available session types */
  readonly sessionTypes = [
    'Terapia Individual',
    'Terapia de Pareja',
    'Terapia Familiar',
    'Terapia Grupal',
    'Evaluación Psicológica',
    'Consulta de Seguimiento'
  ];

  /** Available session modes */
  readonly sessionModes: ('Online' | 'Presencial')[] = ['Presencial', 'Online'];
  
  /** Available payment methods */
  readonly paymentMethods: ('cash' | 'card' | 'transfer' | 'bizum')[] = ['cash', 'card', 'transfer', 'bizum'];
  
  /** Available payment statuses */
  readonly paymentStatuses: ('pending' | 'paid' | 'partial')[] = ['pending', 'paid', 'partial'];

  /** Mock patient data */
  readonly patients = [
    { id: 101, name: 'Ana García' },
    { id: 102, name: 'Carlos López' },
    { id: 103, name: 'María Rodríguez' },
    { id: 104, name: 'Juan Martínez' },
    { id: 105, name: 'Laura Sánchez' },
    { id: 106, name: 'Pedro González' }
  ];

  /** Reactive form for session data */
  sessionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Initialize reactive form
    this.sessionForm = this.fb.group({
      patient_id: ['', Validators.required],
      patient_name: [''],
      clinic_id: ['', Validators.required],
      session_date: [formattedDate, Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      mode: ['Presencial', Validators.required],
      type: ['Terapia Individual', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      payment_method: ['cash', Validators.required],
      payment_status: ['pending', Validators.required],
      completed: [false],
      cancelled: [false],
      no_show: [false],
      notes: ['']
    });
  }

  /**
   * Handles backdrop click to close modal
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  /**
   * Emits close event to parent component
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Updates patient name when patient selection changes
   */
  onPatientChange(): void {
    const patientId = this.sessionForm.get('patient_id')?.value;
    if (patientId) {
      const patient = this.patients.find(p => p.id === parseInt(patientId));
      this.sessionForm.patchValue({
        patient_name: patient ? patient.name : ''
      });
    }
  }

  /**
   * Automatically sets end time to 1 hour after start time
   */
  onStartTimeChange(): void {
    const startTime = this.sessionForm.get('start_time')?.value;
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours + 1, minutes, 0);
      const endTime = endDate.toTimeString().slice(0, 5);
      
      this.sessionForm.patchValue({
        end_time: endTime
      });
    }
  }

  /**
   * Handles form submission with validation
   */
  onSubmit(): void {
    this.error.set(null);

    // Check form validity
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      this.error.set('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formData = this.sessionForm.value;

    // Validate time
    if (formData.start_time >= formData.end_time) {
      this.error.set('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      const sessionData: Omit<SessionData['SessionDetailData'], 'session_id' | 'created_at' | 'updated_at'> = {
        session_date: formData.session_date,
        start_time: formData.start_time + ':00',
        end_time: formData.end_time + ':00',
        type: formData.type,
        mode: formData.mode,
        price: parseFloat(formData.price),
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        completed: formData.completed,
        cancelled: formData.cancelled,
        no_show: formData.no_show,
        notes: formData.notes || undefined,
        PatientData: {
          id: parseInt(formData.patient_id),
          name: formData.patient_name || this.getPatientName(parseInt(formData.patient_id))
        },
        ClinicDetailData: {
          clinic_id: parseInt(formData.clinic_id),
          clinic_name: this.getClinicName(parseInt(formData.clinic_id))
        },
        MedicalRecordData: []
      };

      this.sessionDataCreated.emit(sessionData);
      this.isLoading.set(false);
    }, 1000);
  }

  /**
   * Gets patient name by ID
   */
  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? patient.name : `Paciente ${patientId}`;
  }

  /**
   * Gets clinic name by ID
   */
  getClinicName(clinicId: number): string {
    const clinic = this.clinicConfigs.find(c => c.id === clinicId);
    return clinic ? clinic.name : `Clínica ${clinicId}`;
  }

  /**
   * Converts payment method code to display text
   */
  getPaymentMethodText(method: 'cash' | 'card' | 'transfer' | 'bizum'): string {
    const paymentMethodTexts = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      bizum: 'Bizum'
    };
    return paymentMethodTexts[method] || method;
  }

  /**
   * Converts payment status code to display text
   */
  getPaymentStatusText(status: 'pending' | 'paid' | 'partial'): string {
    const paymentStatusTexts = {
      pending: 'Pendiente',
      paid: 'Pagado',
      partial: 'Parcial'
    };
    return paymentStatusTexts[status] || status;
  }

  // Form update methods for reactive forms
  updatePatientId(value: string): void {
    this.sessionForm.patchValue({ patient_id: value });
    this.onPatientChange();
  }

  updateClinicId(value: string): void {
    this.sessionForm.patchValue({ clinic_id: value });
  }

  updateSessionDate(value: string): void {
    this.sessionForm.patchValue({ session_date: value });
  }

  updateStartTime(value: string): void {
    this.sessionForm.patchValue({ start_time: value });
    this.onStartTimeChange();
  }

  updateEndTime(value: string): void {
    this.sessionForm.patchValue({ end_time: value });
  }

  updateSessionType(value: string): void {
    this.sessionForm.patchValue({ type: value });
  }

  updateMode(value: 'Online' | 'Presencial'): void {
    this.sessionForm.patchValue({ mode: value });
  }

  updatePrice(value: string): void {
    this.sessionForm.patchValue({ price: value });
  }

  updatePaymentMethod(value: 'cash' | 'card' | 'transfer' | 'bizum'): void {
    this.sessionForm.patchValue({ payment_method: value });
  }

  updatePaymentStatus(value: 'pending' | 'paid' | 'partial'): void {
    this.sessionForm.patchValue({ payment_status: value });
  }

  updateCompleted(value: boolean): void {
    this.sessionForm.patchValue({ completed: value });
  }

  updateNotes(value: string): void {
    this.sessionForm.patchValue({ notes: value });
  }

  toggleDropdown(dropdown: 'patient' | 'clinic' | 'type' | 'payment' | 'modality'): void {
    this.dropdownStates.update(states => ({
      patient: false,
      clinic: false,
      type: false,
      payment: false,
      modality: false,
      [dropdown]: !states[dropdown]
    }));
  }

  selectOption(dropdown: 'patient' | 'clinic' | 'type' | 'payment' | 'modality', value: string): void {
    this.dropdownStates.update(states => ({ ...states, [dropdown]: false }));
    
    switch (dropdown) {
      case 'patient':
        this.updatePatientId(value);
        break;
      case 'clinic':
        this.updateClinicId(value);
        break;
      case 'type':
        this.updateSessionType(value);
        break;
      case 'payment':
        this.updatePaymentMethod(value as any);
        break;
      case 'modality':
        this.updateMode(value as any);
        break;
    }
  }

  /**
   * Gets display value for dropdown based on current form state
   */
  getDisplayValue(dropdown: 'patient' | 'clinic' | 'type' | 'payment' | 'modality'): string {
    const form = this.sessionForm;
    
    switch (dropdown) {
      case 'patient':
        const patientId = form.get('patient_id')?.value;
        if (patientId) {
          const patient = this.patients.find(p => p.id === parseInt(patientId));
          return patient ? patient.name : 'Seleccionar paciente';
        }
        return 'Seleccionar paciente';
      case 'clinic':
        const clinicId = form.get('clinic_id')?.value;
        if (clinicId) {
          const clinic = this.clinicConfigs.find(c => c.id === parseInt(clinicId));
          return clinic ? clinic.name : 'Seleccionar clínica';
        }
        return 'Seleccionar clínica';
      case 'type':
        return form.get('type')?.value || 'Seleccionar tipo';
      case 'payment':
        const paymentMethod = form.get('payment_method')?.value;
        return paymentMethod ? this.getPaymentMethodText(paymentMethod) : 'Seleccionar método';
      case 'modality':
        return form.get('mode')?.value || 'Seleccionar modalidad';
      default:
        return '';
    }
  }
}