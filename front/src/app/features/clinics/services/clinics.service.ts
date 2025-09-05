import { Injectable, signal } from '@angular/core';
import { of, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
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

  // Mock data inicial - matches original React data exactly
  private mockClinics: Clinic[] = [
    {
      id: 'clinic-a',
      name: 'Centro de Psicología San Rafael',
      address: 'Calle Mayor 123, 28001 Madrid',
      clinic_color: '#0891b2',
    },
    {
      id: 'clinic-b',
      name: 'Clínica Mental Health Plus',
      address: 'Avenida de la Paz 456, 28002 Madrid',
      clinic_color: '#ec4899',
    },
    {
      id: 'clinic-c',
      name: 'Instituto de Bienestar Emocional',
      address: 'Plaza de España 789, 28008 Madrid',
      clinic_color: '#6366f1',
    },
    {
      id: 'clinic-d',
      name: 'Consulta Privada Dr. Psicólogo',
      address: 'Calle Serrano 321, 28006 Madrid',
      clinic_color: '#be123c',
    },
  ];

  private clinics = signal<Clinic[]>(this.mockClinics);
  private loading = signal(false);

  // Getters readonly
  get all() {
    return this.clinics.asReadonly();
  }

  get isLoading() {
    return this.loading.asReadonly();
  }

  /**
   * Cargar datos iniciales - Intenta API real, fallback a mock
   */
  private loadInitialData(): void {
    // Intentar cargar desde API, si falla usar mock data
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
        // En caso de error, usar datos mock como fallback
        this.clinics.set(this.mockClinics);
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
