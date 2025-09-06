import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinica-form',
  standalone: true,
  templateUrl: './clinica-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ClinicaFormComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() clinica: Clinic | null = null;

  @Output() onSave = new EventEmitter<Clinic>();
  @Output() onCancel = new EventEmitter<void>();

  clinicaForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clinica'] || changes['isOpen']) {
      if (this.isOpen) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }
  }

  private initializeForm(): void {
    this.clinicaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      clinic_color: ['#3b82f6', [Validators.required]]
    });
  }

  private populateForm(): void {
    if (this.clinica) {
      this.clinicaForm.patchValue({
        name: this.clinica.name,
        address: this.clinica.address,
        clinic_color: this.clinica.clinic_color
      });
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.clinicaForm.reset({
      name: '',
      address: '',
      clinic_color: '#3b82f6'
    });
  }

  get isEditing(): boolean {
    return this.clinica !== null;
  }

  get title(): string {
    return this.isEditing ? 'Editar Clínica' : 'Crear Nueva Clínica';
  }

  get submitButtonText(): string {
    return this.isEditing ? 'Actualizar Clínica' : 'Crear Clínica';
  }

  get isFormValid(): boolean {
    return this.clinicaForm.valid;
  }

  handleSubmit(): void {
    if (this.clinicaForm.valid) {
      const formData = this.clinicaForm.value;

      if (this.isEditing && this.clinica) {
        const updatedClinic: Clinic = {
          ...this.clinica,
          ...formData
        };
        this.onSave.emit(updatedClinic);
      } else {
        this.onSave.emit(formData);
      }
    }
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.clinicaForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${minLength} caracteres`;
      }
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre de la clínica',
      address: 'Dirección',
      clinic_color: 'Color identificativo'
    };
    return labels[fieldName] || fieldName;
  }
}
