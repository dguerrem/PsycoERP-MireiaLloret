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
import { Clinic } from '../../../clinics/models/clinic.model';

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
  @Input() clinics: Clinic[] = [];

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
      // Datos personales básicos
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      birth_date: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      occupation: ['', [Validators.required]],

      // Dirección completa
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      door: [''],
      postal_code: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],

      // Datos del tratamiento
      session_price: ['', [Validators.required, Validators.min(0)]],
      clinic_id: ['', [Validators.required]],
      treatment_start_date: ['', [Validators.required]],
      treatment_status: ['en_curso', [Validators.required]],

      // Campos automáticos
      is_minor: [false],
      created_at: [''],
      updated_at: [''],
    });
  }

  private populateForm(): void {
    if (this.patient) {
      this.patientForm.patchValue({
        name: this.patient.name,
        surname: this.patient.surname || '',
        email: this.patient.email,
        phone: this.patient.phone,
        dni: this.patient.dni,
        birth_date: this.patient.birth_date,
        gender: this.patient.gender || '',
        occupation: this.patient.occupation || '',
        street: this.patient.street || '',
        number: this.patient.number || '',
        door: this.patient.door || '',
        postal_code: this.patient.postal_code || '',
        city: this.patient.city || '',
        province: this.patient.province || '',
        session_price: this.patient.session_price || '',
        clinic_id: this.patient.clinic_id || '',
        treatment_start_date: this.patient.treatment_start_date || '',
        treatment_status: this.patient.treatment_status || 'en_curso',
        is_minor: this.patient.is_minor || false,
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
      surname: '',
      email: '',
      phone: '',
      dni: '',
      birth_date: '',
      gender: '',
      occupation: '',
      street: '',
      number: '',
      door: '',
      postal_code: '',
      city: '',
      province: '',
      session_price: '',
      clinic_id: '',
      treatment_start_date: '',
      treatment_status: 'en_curso',
      is_minor: false,
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

  /**
   * Calculate if patient is minor based on birth date
   */
  calculateIsMinor(): void {
    const birthDate = this.patientForm.get('birth_date')?.value;
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();

      const actualAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
      const isMinor = actualAge < 18;

      this.patientForm.patchValue({ is_minor: isMinor });
    }
  }

  /**
   * Handle birth date change to calculate if minor
   */
  onBirthDateChange(): void {
    this.calculateIsMinor();
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      surname: 'Apellidos',
      email: 'Email',
      phone: 'Teléfono',
      dni: 'DNI',
      birth_date: 'Fecha de nacimiento',
      gender: 'Sexo',
      occupation: 'Escuela/Trabajo',
      street: 'Calle',
      number: 'Número',
      door: 'Puerta',
      postal_code: 'Código postal',
      city: 'Ciudad',
      province: 'Provincia',
      session_price: 'Precio de la sesión',
      clinic_id: 'Clínica',
      treatment_start_date: 'Fecha inicio tratamiento',
      treatment_status: 'Estado del tratamiento',
    };
    return labels[fieldName] || fieldName;
  }
}