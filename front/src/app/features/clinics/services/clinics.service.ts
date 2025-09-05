import { Injectable, signal } from '@angular/core';
import { Clinic, ClinicFormData } from '../models/clinic.model';

/**
 * Servicio para gestionar las clínicas
 * Maneja el estado global de las clínicas usando signals
 */
@Injectable({ providedIn: 'root' })
export class ClinicsService {
  // Mock data inicial - matches original React data exactly
  private mockClinics: Clinic[] = [
    {
      id: 'clinic-a',
      name: 'Centro de Psicología San Rafael',
      address: 'Calle Mayor 123, 28001 Madrid',
      clinic_color: '#0891b2'
    },
    {
      id: 'clinic-b',
      name: 'Clínica Mental Health Plus',
      address: 'Avenida de la Paz 456, 28002 Madrid',
      clinic_color: '#ec4899'
    },
    {
      id: 'clinic-c',
      name: 'Instituto de Bienestar Emocional',
      address: 'Plaza de España 789, 28008 Madrid',
      clinic_color: '#6366f1'
    },
    {
      id: 'clinic-d',
      name: 'Consulta Privada Dr. Psicólogo',
      address: 'Calle Serrano 321, 28006 Madrid',
      clinic_color: '#be123c'
    }
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
   * Crear una nueva clínica
   */
  createClinic(formData: ClinicFormData): void {
    const newClinic: Clinic = {
      id: `clinic-${Date.now()}`,
      name: formData.name,
      address: formData.address,
      clinic_color: formData.clinic_color
    };

    this.clinics.update(clinics => [...clinics, newClinic]);
  }

  /**
   * Actualizar una clínica existente
   */
  updateClinic(clinicId: string, formData: ClinicFormData): void {
    this.clinics.update(clinics => 
      clinics.map(clinic => 
        clinic.id === clinicId 
          ? { ...clinic, ...formData } 
          : clinic
      )
    );
  }

  /**
   * Eliminar una clínica
   */
  deleteClinic(clinicId: string): void {
    this.clinics.update(clinics => 
      clinics.filter(clinic => clinic.id !== clinicId)
    );
  }

  /**
   * Obtener ID de badge para mostrar en la UI
   */
  getBadgeId(clinicId: string): string {
    return clinicId.split('-')[1] || '';
  }
}