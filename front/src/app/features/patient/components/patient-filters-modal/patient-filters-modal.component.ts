import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface PatientFilters {
  name?: string;
  email?: string;
  dni?: string;
}

@Component({
  selector: 'app-patient-filters-modal',
  standalone: true,
  templateUrl: './patient-filters-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class PatientFiltersModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() currentFilters: PatientFilters = {};

  @Output() onApplyFilters = new EventEmitter<PatientFilters>();
  @Output() onClearFilters = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  filtersForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      name: [''],
      email: [''],
      dni: [''],
    });
  }

  private populateForm(): void {
    if (this.currentFilters) {
      this.filtersForm.patchValue({
        name: this.currentFilters.name || '',
        email: this.currentFilters.email || '',
        dni: this.currentFilters.dni || '',
      });
    }
  }

  /**
   * Apply filters and close modal
   */
  handleApplyFilters(): void {
    const formValue = this.filtersForm.value;

    // Only include non-empty values
    const filters: PatientFilters = {};

    if (formValue.name?.trim()) {
      filters.name = formValue.name.trim();
    }

    if (formValue.email?.trim()) {
      filters.email = formValue.email.trim();
    }

    if (formValue.dni?.trim()) {
      filters.dni = formValue.dni.trim();
    }

    this.onApplyFilters.emit(filters);
  }

  /**
   * Clear all filters and close modal
   */
  handleClearFilters(): void {
    this.filtersForm.reset({
      name: '',
      email: '',
      dni: '',
    });

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
      formValue.name?.trim() ||
      formValue.email?.trim() ||
      formValue.dni?.trim()
    );
  }
}