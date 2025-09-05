import { Injectable, signal } from '@angular/core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Clinic, ClinicFormData } from '../models/clinic.model';

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
  private loading = signal(false);

  // Getters readonly
  get all() {
    return this.clinics.asReadonly();
  }

  get isLoading() {
    return this.loading.asReadonly();
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
  createClinic(formData: ClinicFormData): void {
    this.loading.set(true);

    // Usar API real
    this.create(formData).subscribe({
      next: (newClinic) => {
        // Recargar todos los datos para asegurar consistencia
        this.loadClinics();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  /**
   * Actualizar una clínica existente - Conecta con API real
   */
  updateClinic(clinicId: string, formData: ClinicFormData): void {
    this.loading.set(true);

    // Usar API real
    this.update(clinicId, formData).subscribe({
      next: (updatedClinic) => {
        // Recargar todos los datos para asegurar consistencia
        this.loadClinics();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  /**
   * Eliminar una clínica - Conecta con API real
   */
  deleteClinic(clinicId: string): void {
    this.loading.set(true);

    // Usar API real
    this.delete(clinicId).subscribe({
      next: () => {
        // Recargar todos los datos para asegurar consistencia
        this.loadClinics();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  /**
   * Cargar clínicas desde la API
   */
  loadClinics(): void {
    this.loading.set(true);

    this.getAll().subscribe({
      next: (clinics) => {
        this.clinics.set(clinics);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  /**
   * Obtener ID de badge para mostrar en la UI
   */
  getBadgeId(clinicId: string): string {
    return clinicId.split('-')[1] || '';
  }
}
