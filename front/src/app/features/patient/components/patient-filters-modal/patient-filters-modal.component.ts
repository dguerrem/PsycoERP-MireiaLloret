import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientFilters } from '../../../../shared/models/patient.model';
import { Clinic } from '../../../clinics/models/clinic.model';
import { ClinicsService } from '../../../clinics/services/clinics.service';

@Component({
  selector: 'app-patient-filters-modal',
  standalone: true,
  templateUrl: './patient-filters-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class PatientFiltersModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() currentFilters: PatientFilters = {};

  @Output() onApplyFilters = new EventEmitter<PatientFilters>();
  @Output() onClearFilters = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  filtersForm!: FormGroup;
  clinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];

  // Clinic selector properties (like in patient-form)
  clinicSearchTerm: string = '';
  isClinicDropdownOpen: boolean = false;
  selectedClinic: Clinic | null = null;

  private fb = inject(FormBuilder);
  private clinicsService = inject(ClinicsService);

  // Options for gender select
  protected genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' }
  ];

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadClinics();
    this.populateForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      dni: [''],
      gender: [''],
      clinic_id: [''],
    });
  }

  private populateForm(): void {
    if (this.currentFilters) {
      this.filtersForm.patchValue({
        first_name: this.currentFilters.first_name || '',
        last_name: this.currentFilters.last_name || '',
        email: this.currentFilters.email || '',
        dni: this.currentFilters.dni || '',
        gender: this.currentFilters.gender || '',
        clinic_id: this.currentFilters.clinic_id || '',
      });

      // Set selected clinic for search display (if clinics are already loaded)
      this.setSelectedClinicFromFilters();
    }
  }

  /**
   * Load all clinics for the select
   */
  private loadClinics(): void {
    this.clinicsService.loadActiveClinics(1, 1000).subscribe({
      next: (response) => {
        this.clinics = response.data || [];
        this.filteredClinics = [...this.clinics];

        // If we have filters with clinic_id, set the selected clinic
        this.setSelectedClinicFromFilters();
      },
      error: (error) => {
        console.error('Error loading clinics:', error);
        this.clinics = [];
        this.filteredClinics = [];
      }
    });
  }

  /**
   * Set selected clinic from current filters
   */
  private setSelectedClinicFromFilters(): void {
    if (this.currentFilters?.clinic_id && this.clinics.length > 0) {
      const clinic = this.clinics.find(c => c.id == this.currentFilters?.clinic_id);
      if (clinic) {
        this.selectedClinic = clinic;
        this.clinicSearchTerm = clinic.name;
        // Also update the form control
        this.filtersForm.patchValue({ clinic_id: clinic.id ? clinic.id.toString() : '' });
      }
    }
  }

  /**
   * Filter clinics based on search term
   */
  filterClinics(): void {
    if (!this.clinicSearchTerm || !this.clinicSearchTerm.trim()) {
      this.filteredClinics = [...this.clinics];
    } else {
      const searchTerm = this.clinicSearchTerm.toLowerCase().trim();
      this.filteredClinics = this.clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  /**
   * Select a clinic from dropdown
   */
  selectClinic(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.filtersForm.patchValue({ clinic_id: clinic.id ? clinic.id.toString() : '' });
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

    this.filterClinics();
    this.isClinicDropdownOpen = true;

    // Clear selection if user is typing something different
    if (this.selectedClinic && this.selectedClinic.name !== this.clinicSearchTerm) {
      this.selectedClinic = null;
      this.filtersForm.patchValue({ clinic_id: '' });
    }
  }

  /**
   * Clear selected clinic
   */
  clearSelectedClinic(): void {
    this.selectedClinic = null;
    this.clinicSearchTerm = '';
    this.filtersForm.patchValue({ clinic_id: '' });
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

  /**
   * Apply filters and close modal
   */
  handleApplyFilters(): void {
    const formValue = this.filtersForm.value;

    // Only include non-empty values
    const filters: PatientFilters = {};

    if (formValue.first_name?.trim()) {
      filters.first_name = formValue.first_name.trim();
    }

    if (formValue.last_name?.trim()) {
      filters.last_name = formValue.last_name.trim();
    }

    if (formValue.email?.trim()) {
      filters.email = formValue.email.trim();
    }

    if (formValue.dni?.trim()) {
      filters.dni = formValue.dni.trim();
    }

    if (formValue.gender) {
      filters.gender = formValue.gender;
    }

    if (formValue.clinic_id) {
      filters.clinic_id = formValue.clinic_id;
    }

    this.onApplyFilters.emit(filters);
  }

  /**
   * Clear all filters and close modal
   */
  handleClearFilters(): void {
    this.filtersForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      dni: '',
      gender: '',
      clinic_id: '',
    });

    // Reset clinic selector
    this.selectedClinic = null;
    this.clinicSearchTerm = '';
    this.isClinicDropdownOpen = false;
    this.filteredClinics = [...this.clinics];

    this.onClearFilters.emit();
  }

  /**
   * Cancel and close modal
   */
  handleCancel(): void {
    this.onCancel.emit();
  }

  /**
   * Check if any filter has a value
   */
  get hasActiveFilters(): boolean {
    const formValue = this.filtersForm.value;
    return !!(
      formValue.first_name?.trim() ||
      formValue.last_name?.trim() ||
      formValue.email?.trim() ||
      formValue.dni?.trim() ||
      formValue.gender ||
      formValue.clinic_id
    );
  }
}
