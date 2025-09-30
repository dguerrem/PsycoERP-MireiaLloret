import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CreateSessionRequest, SessionData } from '../../../../shared/models/session.model';
import { PatientSelector } from '../../../../shared/models/patient.model';
import { SessionsService } from '../../services/sessions.service';
import { ReusableModalComponent } from '../../../../shared/components/reusable-modal/reusable-modal.component';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { PatientSelectorComponent } from '../../../../shared/components/patient-selector/patient-selector.component';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { environment } from '../../../../../environments/environment';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReusableModalComponent,
    FormInputComponent,
    PatientSelectorComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './new-session-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSessionFormComponent implements OnInit {
  @Input() prefilledData: { date: string; startTime: string | null; sessionData?: SessionData } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() sessionDataCreated = new EventEmitter<SessionData>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private sessionsService = inject(SessionsService);

  /** Loading state signal */
  readonly isLoading = signal(false);

  /** Error message signal */
  readonly error = signal<string | null>(null);

  /** Confirmation modal state */
  readonly showCancelConfirmation = signal<boolean>(false);
  private pendingCancelAction: (() => void) | null = null;

  /** Patients data from API */
  patients = signal<PatientSelector[]>([]);
  selectedPatient = signal<PatientSelector | null>(null);

  readonly modeOptions = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'online', label: 'Online' }
  ];

  readonly paymentMethodOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'bizum', label: 'Bizum' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'efectivo', label: 'Efectivo' }
  ];

  readonly statusOptions = [
    { value: 'programada', label: 'Programada' },
    { value: 'finalizada', label: 'Finalizada' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  /** Reactive form for session data */
  sessionForm!: FormGroup;

  /** Check if we're in edit mode */
  get isEditMode(): boolean {
    return !!this.prefilledData?.sessionData;
  }

  /** Get the session ID for editing */
  get sessionId(): number | null {
    return this.prefilledData?.sessionData?.SessionDetailData.session_id || null;
  }

  ngOnInit(): void {
    this.loadPatients();
    this.initializeForm();
  }

  private initializeForm(): void {
    const sessionData = this.prefilledData?.sessionData;
    const isEditMode = !!sessionData;

    const defaultDate = this.prefilledData?.date || new Date().toISOString().split('T')[0];
    const defaultStartTime = this.prefilledData?.startTime || '';

    // If in edit mode, use session data to prefill the form
    const formValues = isEditMode ? {
      patient_id: sessionData!.SessionDetailData.PatientData.id,
      session_date: sessionData!.SessionDetailData.session_date,
      start_time: sessionData!.SessionDetailData.start_time.substring(0, 5),
      end_time: sessionData!.SessionDetailData.end_time.substring(0, 5),
      mode: sessionData!.SessionDetailData.mode.toLowerCase(),
      price: sessionData!.SessionDetailData.price,
      payment_method: sessionData!.SessionDetailData.payment_method || 'pendiente',
      status: sessionData!.SessionDetailData.status || 'programada',
      notes: sessionData!.SessionDetailData.notes || ''
    } : {
      patient_id: null,
      session_date: defaultDate,
      start_time: defaultStartTime,
      end_time: '',
      mode: 'presencial',
      price: 0,
      payment_method: 'pendiente',
      status: 'programada',
      notes: ''
    };

    this.sessionForm = this.fb.group({
      patient_id: [{value: formValues.patient_id, disabled: isEditMode}, [Validators.required]],
      session_date: [formValues.session_date, [Validators.required]],
      start_time: [formValues.start_time, [Validators.required]],
      end_time: [formValues.end_time, [Validators.required]],
      mode: [{value: formValues.mode, disabled: true}, [Validators.required]],
      price: [formValues.price, [Validators.required, Validators.min(0.01)]],
      payment_method: [{value: formValues.payment_method, disabled: !isEditMode}, [Validators.required]],
      status: [{value: formValues.status, disabled: !isEditMode}, [Validators.required]],
      notes: [formValues.notes]
    });

    // If start time is prefilled and not in edit mode, calculate end time automatically
    if (defaultStartTime && !isEditMode) {
      this.updateEndTime(defaultStartTime);
    }

    // Watch for patient selection changes
    this.sessionForm.get('patient_id')?.valueChanges.subscribe(patientId => {
      const patient = this.patients().find(p => p.idPaciente === patientId);
      this.selectedPatient.set(patient || null);

      // Update price and mode when patient changes
      if (patient) {
        const mode = patient.presencial ? 'presencial' : 'online';
        this.sessionForm.patchValue({
          price: parseFloat(this.netPrice.toFixed(2)),
          mode: mode
        });
      }
    });

    // Watch for start time changes and automatically update end time
    this.sessionForm.get('start_time')?.valueChanges.subscribe(startTime => {
      if (startTime) {
        this.updateEndTime(startTime);
      }
    });
  }

  private loadPatients(): void {
    this.http.get<{ data: PatientSelector[] }>(`${environment.api.baseUrl}/patients/active-with-clinic`)
      .subscribe({
        next: (response) => {
          this.patients.set(response.data);

          // If in edit mode, set the selected patient after loading patients
          if (this.isEditMode && this.prefilledData?.sessionData) {
            const patientId = this.prefilledData.sessionData.SessionDetailData.PatientData.id;
            const patient = response.data.find(p => p.idPaciente === patientId);
            if (patient) {
              this.selectedPatient.set(patient);
              // Set the mode based on patient's presencial setting
              const mode = patient.presencial ? 'presencial' : 'online';
              this.sessionForm.get('mode')?.setValue(mode);
            }
          }
        },
        error: (error) => {
          console.error('Error loading patients:', error);
        }
      });
  }


  onClose(): void {
    this.sessionForm.reset({
      mode: 'presencial'
    });
    this.selectedPatient.set(null);
    this.close.emit();
  }

  onCancelConfirm(): void {
    this.showCancelConfirmation.set(false);
    // Execute the pending submit action
    if (this.pendingCancelAction) {
      this.pendingCancelAction();
      this.pendingCancelAction = null;
    }
  }

  onCancelReject(): void {
    this.showCancelConfirmation.set(false);
    // Revert the status back to the previous value
    const currentSessionData = this.prefilledData?.sessionData;
    const originalStatus = currentSessionData?.SessionDetailData.status || 'programada';
    this.sessionForm.get('status')?.setValue(originalStatus, { emitEvent: false });
    this.pendingCancelAction = null;
  }


  onStartTimeChange(): void {
    const startTime = this.sessionForm.get('start_time')?.value;
    if (startTime) {
      this.updateEndTime(startTime);
    }
  }

  private updateEndTime(startTime: string): void {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours + 1, minutes, 0);
    const endTime = endDate.toTimeString().slice(0, 5);

    this.sessionForm.patchValue({
      end_time: endTime,
    }, { emitEvent: false }); // emitEvent: false para evitar loops infinitos
  }

  private convertTimeToMySQL(time: string): string {
    // Convert HH:mm to HH:mm:ss format for MySQL TIME column
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }


  onSubmit(): void {
    this.error.set(null);

    // Prevent double submission
    if (this.isLoading()) {
      return;
    }

    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      this.error.set('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formValue = this.sessionForm.getRawValue(); // Use getRawValue() to include disabled fields
    const patient = this.selectedPatient();

    if (!patient) {
      this.error.set('Debe seleccionar un paciente.');
      return;
    }

    // Validate time
    if (formValue.start_time >= formValue.end_time) {
      this.error.set('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    // Check if status is 'cancelada' in edit mode and show confirmation
    if (this.isEditMode && formValue.status === 'cancelada') {
      const currentSessionData = this.prefilledData?.sessionData;
      const originalStatus = currentSessionData?.SessionDetailData.status || 'programada';

      // Only show confirmation if status is changing TO 'cancelada'
      if (originalStatus !== 'cancelada') {
        this.showCancelConfirmation.set(true);
        // Store the submit action to execute after confirmation
        this.pendingCancelAction = () => this.executeSubmit();
        return;
      }
    }

    this.executeSubmit();
  }

  private executeSubmit(): void {
    const formValue = this.sessionForm.getRawValue();
    const patient = this.selectedPatient();

    if (!patient) {
      this.error.set('Debe seleccionar un paciente.');
      return;
    }

    this.isLoading.set(true);

    const sessionData: CreateSessionRequest = {
      patient_id: formValue.patient_id,
      clinic_id: patient.idClinica,
      session_date: formValue.session_date,
      start_time: this.convertTimeToMySQL(formValue.start_time),
      end_time: this.convertTimeToMySQL(formValue.end_time),
      mode: formValue.mode,
      status: formValue.status,
      price: formValue.price,
      payment_method: formValue.payment_method,
      notes: formValue.notes || null
    };

    if (this.isEditMode && this.sessionId) {
      // Update existing session
      this.sessionsService.updateSession(this.sessionId, sessionData).subscribe({
        next: (updatedSession) => {
          this.sessionDataCreated.emit(updatedSession);
          this.isLoading.set(false);
          this.onClose();
        },
        error: (error) => {
          console.error('Error updating session:', error);
          this.error.set('Error al actualizar la sesión. Por favor, intenta de nuevo.');
          this.isLoading.set(false);
        }
      });
    } else {
      // Create new session
      this.sessionsService.createSession(sessionData).subscribe({
        next: (createdSession) => {
          this.sessionDataCreated.emit(createdSession);
          this.isLoading.set(false);
          this.onClose();
        },
        error: (error) => {
          console.error('Error creating session:', error);
          this.error.set('Error al crear la sesión. Por favor, intenta de nuevo.');
          this.isLoading.set(false);
        }
      });
    }
  }

  get isFormValid(): boolean {
    return this.sessionForm.valid;
  }

  get selectedPatientData(): PatientSelector | null {
    return this.selectedPatient();
  }

  get netPrice(): number {
    const patient = this.selectedPatient();
    if (!patient) return 0;

    return patient.precioSesion * (patient.porcentaje / 100);
  }
}
