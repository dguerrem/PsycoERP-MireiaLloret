import { Injectable, signal } from '@angular/core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Clinic } from '../models/clinic.model';

/**
 * Servicio para gestionar las clínicas
 * Extiende BaseCrudService para operaciones CRUD con manejo de errores automático
 * Maneja el estado global de las clínicas usando signals
 */
@Injectable({ providedIn: 'root' })
export class ClinicsService extends BaseCrudService<Clinic> {
  constructor() {
    super('/clinics', 'Clínica');
    this.loadInitialData();
  }

  private clinics = signal<Clinic[]>([]);

  // Getters readonly
  get all() {
    return this.clinics.asReadonly();
  }

  /**
   * Cargar datos iniciales desde la API
   */
  private loadInitialData(): void {
    this.loadClinics();
  }

  /**
   * Crear una nueva clínica - Conecta con API real
   */
  createClinic(formData: Clinic): void {
    // Usar API real - el loading se maneja automáticamente en BaseCrudService
    this.create(formData).subscribe({
      next: (newClinic) => {
        // Recargar todos los datos para asegurar consistencia
        this.loadClinics();
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Actualizar una clínica existente - Conecta con API real
   */
  updateClinic(clinicId: string, formData: Clinic): void {
    // Usar API real - el loading se maneja automáticamente en BaseCrudService
    this.update(clinicId, formData).subscribe({
      next: (updatedClinic) => {
        // Recargar todos los datos para asegurar consistencia
        this.loadClinics();
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Eliminar una clínica - Conecta con API real
   */
  deleteClinic(clinicId: string): void {
    // Usar API real - el loading se maneja automáticamente en BaseCrudService
    this.delete(clinicId).subscribe({
      next: () => {
        // Recargar todos los datos para asegurar consistencia
        this.loadClinics();
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }

  /**
   * Cargar clínicas desde la API
   */
  loadClinics(): void {
    // El loading se maneja automáticamente en BaseCrudService
    this.getAll().subscribe({
      next: (clinics) => {
        this.clinics.set(clinics);
      },
      error: () => {
        // Error handling manejado por errorInterceptor
      },
    });
  }
}
