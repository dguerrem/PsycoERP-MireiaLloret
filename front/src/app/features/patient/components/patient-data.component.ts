import {
  Component,
  ChangeDetectionStrategy,
  Input,
  signal,
  computed,
  inject,
  OnInit,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../../../shared/models/patient.model';

/**
 * Patient Data Component
 *
 * Displays and allows editing of patient personal, contact, and treatment information
 */
@Component({
  selector: 'app-patient-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDataComponent implements OnInit, OnChanges {
  @Input() patient!: Patient;

  private fb = inject(FormBuilder);

  readonly isEditing = signal(false);
  readonly patientForm: FormGroup;

  constructor() {
    this.patientForm = this.fb.group({
      // Personal Information
      full_name: ['', Validators.required],
      dni: ['', Validators.required],
      birth_date: ['', Validators.required],
      occupation: [''],

      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],

      // Treatment Information
      tipo_clinica: [''],
      nombre_clinica: [''],
      treatment_start_date: [''],
      status: ['']
    });
  }

  readonly age = computed(() => {
    if (!this.patient?.birth_date) return 0;

    const birthDate = new Date(this.patient.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  });

  ngOnInit() {
    if (this.patient) {
      this.loadPatientData();
      this.patientForm.disable(); // Disable form by default
    }
  }

  ngOnChanges() {
    if (this.patient) {
      this.loadPatientData();
      if (!this.isEditing()) {
        this.patientForm.disable(); // Keep disabled when patient changes
      }
    }
  }

  private loadPatientData() {
    this.patientForm.patchValue({
      full_name: `${this.patient.first_name} ${this.patient.last_name}`,
      dni: this.patient.dni,
      birth_date: this.patient.birth_date,
      occupation: this.patient.occupation,
      email: this.patient.email,
      phone: this.patient.phone,
      address: `${this.patient.street} ${this.patient.street_number} ${this.patient.door}, ${this.patient.city}, ${this.patient.province} ${this.patient.postal_code}`.trim(),
      tipo_clinica: this.patient.tipo_clinica || '',
      nombre_clinica: this.patient.nombre_clinica || '',
      treatment_start_date: this.patient.treatment_start_date,
      status: this.patient.status
    });
  }

  onEdit() {
    this.isEditing.set(true);
    this.patientForm.enable();
  }

  onSave() {
    if (this.patientForm.valid) {
      // TODO: Implement save logic - call API
      console.log('Saving patient data:', this.patientForm.value);
      this.isEditing.set(false);
      this.patientForm.disable();
    }
  }

  onCancel() {
    this.loadPatientData(); // Reset to original values
    this.isEditing.set(false);
    this.patientForm.disable();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'en curso':
        return 'bg-green-100 text-green-800';
      case 'fin del tratamiento':
        return 'bg-blue-100 text-blue-800';
      case 'en pausa':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandono':
      case 'derivación':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
}