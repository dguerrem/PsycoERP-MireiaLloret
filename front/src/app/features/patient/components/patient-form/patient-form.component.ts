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
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient, CreatePatientRequest } from '../../../../shared/models/patient.model';
import { Clinic } from '../../../clinics/models/clinic.model';
import { ClinicsService } from '../../../clinics/services/clinics.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  templateUrl: './patient-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class PatientFormComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() patient: Patient | null = null;

  // Clinic selector properties
  clinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];
  clinicSearchTerm: string = '';
  isClinicDropdownOpen: boolean = false;
  selectedClinic: Clinic | null = null;

  @Output() onSave = new EventEmitter<Patient>();
  @Output() onCancel = new EventEmitter<void>();

  patientForm!: FormGroup;

  // Options for selects
  protected genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' }
  ];

  protected statusOptions = [
    { value: 'en curso', label: 'En curso' },
    { value: 'fin del tratamiento', label: 'Fin del tratamiento' },
    { value: 'en pausa', label: 'En pausa' },
    { value: 'abandono', label: 'Abandono' },
    { value: 'derivación', label: 'Derivación' }
  ];

  constructor(
    private fb: FormBuilder,
    private clinicsService: ClinicsService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadClinics();
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
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      birth_date: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      occupation: ['', [Validators.required]],

      // Dirección completa
      street: ['', [Validators.required]],
      street_number: ['', [Validators.required]],
      door: [''],
      postal_code: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],

      // Datos del tratamiento
      clinic_id: ['', [Validators.required]],
      treatment_start_date: ['', [Validators.required]],
      status: ['en curso', [Validators.required]],

      // Campos automáticos
      is_minor: [false],
    });
  }

  private populateForm(): void {
    if (this.patient) {
      this.patientForm.patchValue({
        first_name: this.patient.first_name || '',
        last_name: this.patient.last_name || '',
        email: this.patient.email || '',
        phone: this.patient.phone || '',
        dni: this.patient.dni || '',
        birth_date: this.patient.birth_date || '',
        gender: this.patient.gender || '',
        occupation: this.patient.occupation || '',
        street: this.patient.street || '',
        street_number: this.patient.street_number || '',
        door: this.patient.door || '',
        postal_code: this.patient.postal_code || '',
        city: this.patient.city || '',
        province: this.patient.province || '',
        clinic_id: this.patient.clinic_id || '',
        treatment_start_date: this.patient.treatment_start_date || '',
        status: this.patient.status || 'en curso',
        is_minor: this.patient.is_minor || false,
      });

      // Set selected clinic for search display (if clinics are already loaded)
      this.setSelectedClinicFromPatient();
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.patientForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      dni: '',
      birth_date: '',
      gender: '',
      occupation: '',
      street: '',
      street_number: '',
      door: '',
      postal_code: '',
      city: '',
      province: '',
      clinic_id: '',
      treatment_start_date: '',
      status: 'en curso',
      is_minor: false,
    });

    // Reset clinic selector
    this.selectedClinic = null;
    this.clinicSearchTerm = '';
    this.isClinicDropdownOpen = false;
    this.filteredClinics = [...this.clinics];
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
        // Para crear nuevo paciente, no incluir el id
        const { id, ...createData } = formData;
        this.onSave.emit(createData);
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
   * Get calculated age based on birth date
   */
  getCalculatedAge(): number {
    const birthDate = this.patientForm.get('birth_date')?.value;
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    return age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
  }

  /**
   * Handle birth date change to calculate if minor
   */
  onBirthDateChange(): void {
    this.calculateIsMinor();
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      first_name: 'Nombre',
      last_name: 'Apellidos',
      email: 'Email',
      phone: 'Teléfono',
      dni: 'DNI',
      birth_date: 'Fecha de nacimiento',
      gender: 'Género',
      occupation: 'Ocupación',
      street: 'Calle',
      street_number: 'Número',
      door: 'Puerta',
      postal_code: 'Código postal',
      city: 'Ciudad',
      province: 'Provincia',
      clinic_id: 'Clínica',
      treatment_start_date: 'Fecha inicio tratamiento',
      status: 'Estado del tratamiento',
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Load all clinics from service
   */
  private loadClinics(): void {
    // Load a large number to get all clinics (not paginated)
    this.clinicsService.loadActiveClinics(1, 1000).subscribe({
      next: (response) => {
        this.clinics = response.data || [];
        this.filteredClinics = [...this.clinics];

        // If we're editing and have a patient with clinic_id, set the selected clinic
        this.setSelectedClinicFromPatient();
      },
      error: (error) => {
        console.error('Error loading clinics:', error);
        this.clinics = [];
        this.filteredClinics = [];
      }
    });
  }

  /**
   * Set selected clinic from patient data
   */
  private setSelectedClinicFromPatient(): void {
    if (this.patient?.clinic_id && this.clinics.length > 0) {
      const clinic = this.clinics.find(c => c.id == this.patient?.clinic_id);
      if (clinic) {
        this.selectedClinic = clinic;
        this.clinicSearchTerm = clinic.name;
        // Also update the form control
        this.patientForm.patchValue({ clinic_id: clinic.id ? clinic.id.toString() : '' });
      }
    }
  }

  /**
   * Filter clinics based on search term
   */
  filterClinics(): void {
    console.log('Filtering with term:', this.clinicSearchTerm, 'Total clinics:', this.clinics.length); // Debug log

    if (!this.clinicSearchTerm || !this.clinicSearchTerm.trim()) {
      this.filteredClinics = [...this.clinics];
    } else {
      const searchTerm = this.clinicSearchTerm.toLowerCase().trim();
      this.filteredClinics = this.clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchTerm)
      );
    }

    console.log('Filtered results:', this.filteredClinics.length); // Debug log
  }

  /**
   * Select a clinic from dropdown
   */
  selectClinic(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.patientForm.patchValue({ clinic_id: clinic.id ? clinic.id.toString() : '' });
    this.clinicSearchTerm = clinic.name;
    this.isClinicDropdownOpen = false;

    // Force update to show selected clinic
    this.filterClinics();
  }

  /**
   * Handle clinic search input (real-time)
   */
  onClinicSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.clinicSearchTerm = target.value;

    console.log('Search term:', this.clinicSearchTerm); // Debug log
    this.filterClinics();
    this.isClinicDropdownOpen = true;

    // Clear selection if user is typing something different
    if (this.selectedClinic && this.selectedClinic.name !== this.clinicSearchTerm) {
      this.selectedClinic = null;
      this.patientForm.patchValue({ clinic_id: '' });
    }
  }

  /**
   * Clear selected clinic
   */
  clearSelectedClinic(): void {
    this.selectedClinic = null;
    this.clinicSearchTerm = '';
    this.patientForm.patchValue({ clinic_id: '' });
    this.filteredClinics = [...this.clinics];
    this.isClinicDropdownOpen = false;
  }

  /**
   * Check if a clinic is currently selected
   */
  isClinicSelected(clinic: Clinic): boolean {
    return this.selectedClinic !== null &&
           this.selectedClinic.id === clinic.id;
  }

  /**
   * Toggle clinic dropdown
   */
  toggleClinicDropdown(): void {
    this.isClinicDropdownOpen = true;
    if (!this.clinicSearchTerm) {
      this.filteredClinics = [...this.clinics];
    } else {
      this.filterClinics();
    }
  }

  /**
   * Close clinic dropdown when clicking outside
   */
  closeClinicDropdown(): void {
    setTimeout(() => {
      this.isClinicDropdownOpen = false;
    }, 150);
  }

}
