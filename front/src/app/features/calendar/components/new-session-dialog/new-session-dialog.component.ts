import {
  Component,
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
    PatientSelectorComponent
  ],
  templateUrl: './new-session-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSessionDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() sessionDataCreated = new EventEmitter<SessionData>();

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private sessionsService = inject(SessionsService);

  /** Loading state signal */
  readonly isLoading = signal(false);

  /** Error message signal */
  readonly error = signal<string | null>(null);

  /** Patients data from API */
  patients = signal<PatientSelector[]>([]);
  selectedPatient = signal<PatientSelector | null>(null);

  readonly modeOptions = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'online', label: 'Online' }
  ];

  /** Reactive form for session data */
  sessionForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadPatients();
  }

  private initializeForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.sessionForm = this.fb.group({
      patient_id: [null, [Validators.required]],
      session_date: [today, [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      mode: ['presencial', [Validators.required]],
      type: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      notes: ['']
    });

    // Watch for patient selection changes
    this.sessionForm.get('patient_id')?.valueChanges.subscribe(patientId => {
      const patient = this.patients().find(p => p.idPaciente === patientId);
      this.selectedPatient.set(patient || null);

      // Update price when patient changes
      if (patient) {
        this.sessionForm.patchValue({
          price: parseFloat(this.netPrice.toFixed(2))
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
    this.http.get<{ data: PatientSelector[] }>('http://localhost:3000/api/patients/active-with-clinic')
      .subscribe({
        next: (response) => {
          this.patients.set(response.data);
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

    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      this.error.set('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formValue = this.sessionForm.value;
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

    this.isLoading.set(true);

    const sessionData: CreateSessionRequest = {
      patient_id: formValue.patient_id,
      clinic_id: patient.idClinica,
      session_date: formValue.session_date,
      start_time: this.convertTimeToMySQL(formValue.start_time),
      end_time: this.convertTimeToMySQL(formValue.end_time),
      mode: formValue.mode,
      type: formValue.type,
      status: 'programada',
      price: formValue.price,
      payment_method: 'efectivo',
      payment_status: 'pending',
      notes: formValue.notes || null
    };

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
