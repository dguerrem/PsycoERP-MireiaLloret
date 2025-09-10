import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Patient } from '../../../shared/models/patient.model';
import { PaginationResponse } from '../../../shared/models/pagination.interface';

@Injectable({ providedIn: 'root' })
export class PatientsService extends BaseCrudService<Patient> {
  constructor() {
    super('/patients', 'Paciente');
  }

  private patients = signal<Patient[]>([]);
  private isLoading = signal(false);
  private paginationData = signal<
    PaginationResponse<Patient>['pagination'] | null
  >(null);

  // Getters readonly
  get all() {
    return this.patients.asReadonly();
  }

  get loading() {
    return this.isLoading.asReadonly();
  }

  get pagination() {
    return this.paginationData.asReadonly();
  }

  /**
   * Cargar datos iniciales desde la API
   */
  private loadInitialData(): void {
    this.loadAndSetActivePatientsPaginated();
  }

  /**
   * Crear un nuevo paciente - Conecta con API real
   */
  createPatient(formData: Partial<Patient>): void {
    this.create(formData).subscribe({
      next: (newPatient) => {
        // Recargar la página actual después de crear
        const currentPagination = this.paginationData();
        if (currentPagination) {
          this.loadAndSetActivePatientsPaginated(
            currentPagination.currentPage,
            currentPagination.recordsPerPage
          );
        } else {
          this.loadAndSetActivePatientsPaginated();
        }
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
        // Recargar la página actual después de actualizar
        const currentPagination = this.paginationData();
        if (currentPagination) {
          this.loadAndSetActivePatientsPaginated(
            currentPagination.currentPage,
            currentPagination.recordsPerPage
          );
        } else {
          this.loadAndSetActivePatientsPaginated();
        }
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
        // Recargar la página actual después de eliminar
        const currentPagination = this.paginationData();
        if (currentPagination) {
          this.loadAndSetActivePatientsPaginated(
            currentPagination.currentPage,
            currentPagination.recordsPerPage
          );
        } else {
          this.loadAndSetActivePatientsPaginated();
        }
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Cargar pacientes activos paginados desde la API
   */
  loadActivePatientsPaginated(
    page = 1,
    per_page = 10
  ): Observable<PaginationResponse<Patient>> {
    return this.getAllPaginated(page, per_page);
  }

  /**
   * Cargar pacientes eliminados paginados desde la API
   */
  loadDeletedPatientsPaginated(
    page = 1,
    per_page = 10
  ): Observable<PaginationResponse<Patient>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', per_page.toString()); // El endpoint deleted usa 'limit' en lugar de 'per_page'

    return this.http.get<PaginationResponse<Patient>>(
      `${this.apiUrl}/deleted`,
      {
        ...this.httpOptions,
        params,
      }
    );
  }

  /**
   * Cargar pacientes paginados desde la API (mantener compatibilidad)
   */
  loadPatientsPaginated(
    page = 1,
    per_page = 10
  ): Observable<PaginationResponse<Patient>> {
    return this.loadActivePatientsPaginated(page, per_page);
  }

  /**
   * Cargar pacientes activos paginados y actualizar estado interno
   */
  loadAndSetActivePatientsPaginated(page = 1, per_page = 10): void {
    this.isLoading.set(true);
    this.loadActivePatientsPaginated(page, per_page).subscribe({
      next: (response) => {
        this.patients.set(response.data);
        this.paginationData.set(response.pagination);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Cargar pacientes eliminados paginados y actualizar estado interno
   */
  loadAndSetDeletedPatientsPaginated(page = 1, per_page = 10): void {
    this.isLoading.set(true);
    this.loadDeletedPatientsPaginated(page, per_page).subscribe({
      next: (response) => {
        this.patients.set(response.data);
        this.paginationData.set(response.pagination);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Cargar pacientes paginados y actualizar estado interno (mantener compatibilidad)
   */
  loadAndSetPatientsPaginated(page = 1, per_page = 10): void {
    this.loadAndSetActivePatientsPaginated(page, per_page);
  }

  /**
   * Cargar pacientes desde la API (sin paginación)
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
    return this.patients().find((patient) => patient.id === id);
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
