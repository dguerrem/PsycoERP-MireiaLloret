import { Injectable, signal } from '@angular/core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Patient } from '../../../shared/models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsService extends BaseCrudService<Patient> {
  constructor() {
    super('/patients', 'Paciente');
    this.loadInitialData();
  }

  private patients = signal<Patient[]>([]);
  private isLoading = signal(false);

  // Getters readonly
  get all() {
    return this.patients.asReadonly();
  }

  get loading() {
    return this.isLoading.asReadonly();
  }

  /**
   * Cargar datos iniciales desde la API
   */
  private loadInitialData(): void {
    this.loadPatients();
  }

  /**
   * Crear un nuevo paciente - Conecta con API real
   */
  createPatient(formData: Partial<Patient>): void {
    this.create(formData).subscribe({
      next: (newPatient) => {
        this.loadPatients();
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Actualizar un paciente existente - Conecta con API real
   */
  updatePatient(patientId: string | number, formData: Partial<Patient>): void {
    this.update(patientId, formData).subscribe({
      next: (updatedPatient) => {
        this.loadPatients();
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Eliminar un paciente - Conecta con API real
   */
  deletePatient(patientId: string | number): void {
    this.delete(patientId).subscribe({
      next: () => {
        this.loadPatients();
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Cargar pacientes desde la API
   */
  loadPatients(): void {
    this.isLoading.set(true);
    this.getAll().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Get patient by ID - compatibility method for existing code
   */
  getPatientById(id: number): Patient | undefined {
    return this.patients().find(patient => patient.id === id);
  }

  /**
   * Select patient - compatibility method for existing code
   */
  selectPatient(patient: Patient | null): void {
    // This method is kept for compatibility with existing code
    // In the new API pattern, we don't need to track selected patient in service
    console.log('Selected patient:', patient);
  }

  /**
   * Add patient - compatibility method that delegates to createPatient
   */
  addPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): void {
    this.createPatient(patient);
  }

}