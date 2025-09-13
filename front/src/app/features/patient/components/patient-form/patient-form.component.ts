import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  templateUrl: './patient-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class PatientFormComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() patient: Patient | null = null;

  @Output() onSave = new EventEmitter<Patient>();
  @Output() onCancel = new EventEmitter<void>();

  patientForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] || changes['isOpen']) {
      if (this.isOpen) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }
  }

  private initializeForm(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      status: ['active', [Validators.required]],
      session_type: ['individual', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      birth_date: ['', [Validators.required]],
      emergency_contact_name: ['', [Validators.required]],
      emergency_contact_phone: ['', [Validators.required]],
      medical_history: [''],
      current_medication: [''],
      allergies: [''],
      referred_by: [''],
      insurance_provider: [''],
      insurance_number: [''],
      notes: [''],
      created_at: [''],
      updated_at: [''],
    });
  }

  private populateForm(): void {
    if (this.patient) {
      this.patientForm.patchValue({
        name: this.patient.name,
        email: this.patient.email,
        phone: this.patient.phone,
        dni: this.patient.dni,
        status: this.patient.status,
        session_type: this.patient.session_type,
        address: this.patient.address,
        birth_date: this.patient.birth_date,
        emergency_contact_name: this.patient.emergency_contact_name,
        emergency_contact_phone: this.patient.emergency_contact_phone,
        medical_history: this.patient.medical_history,
        current_medication: this.patient.current_medication,
        allergies: this.patient.allergies,
        referred_by: this.patient.referred_by,
        insurance_provider: this.patient.insurance_provider,
        insurance_number: this.patient.insurance_number,
        notes: this.patient.notes,
        created_at: this.patient.created_at,
        updated_at: this.patient.updated_at,
      });
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.patientForm.reset({
      name: '',
      email: '',
      phone: '',
      dni: '',
      status: 'active',
      session_type: 'individual',
      address: '',
      birth_date: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      medical_history: '',
      current_medication: '',
      allergies: '',
      referred_by: '',
      insurance_provider: '',
      insurance_number: '',
      notes: '',
      created_at: '',
      updated_at: '',
    });
  }

  get isEditing(): boolean {
    return this.patient !== null;
  }

  get title(): string {
    return this.isEditing ? 'Editar Paciente' : 'Crear Nuevo Paciente';
  }

  get submitButtonText(): string {
    return this.isEditing ? 'Actualizar Paciente' : 'Crear Paciente';
  }

  get isFormValid(): boolean {
    return this.patientForm.valid;
  }

  handleSubmit(): void {
    if (this.patientForm.valid) {
      const formData = this.patientForm.value;

      if (this.isEditing && this.patient) {
        const updatedPatient: Patient = {
          ...this.patient,
          ...formData,
        };
        this.onSave.emit(updatedPatient);
      } else {
        this.onSave.emit(formData);
      }
    }
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.patientForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} debe tener al menos ${minLength} caracteres`;
      }
      if (field.errors?.['email']) {
        return 'Ingrese un email válido';
      }
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre completo',
      email: 'Email',
      phone: 'Teléfono',
      dni: 'DNI',
      status: 'Estado',
      session_type: 'Tipo de sesión',
      address: 'Dirección',
      birth_date: 'Fecha de nacimiento',
      emergency_contact_name: 'Contacto de emergencia',
      emergency_contact_phone: 'Teléfono de emergencia',
      medical_history: 'Historial médico',
      current_medication: 'Medicación actual',
      allergies: 'Alergias',
      referred_by: 'Referido por',
      insurance_provider: 'Aseguradora',
      insurance_number: 'Número de póliza',
      notes: 'Notas',
    };
    return labels[fieldName] || fieldName;
  }
}