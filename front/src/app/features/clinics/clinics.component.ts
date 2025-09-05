import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicsService } from './services/clinics.service';
import { Clinic, ClinicFormData } from './models/clinic.model';

@Component({
  selector: 'app-clinics',
  standalone: true,
  templateUrl: './clinics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ClinicsComponent {

  // Services
  private clinicsService = inject(ClinicsService);

  // State signals
  protected isNewClinicOpen = signal(false);
  protected editingClinic = signal<Clinic | null>(null);
  protected deletingClinic = signal<Clinic | null>(null);
  protected formData = signal<ClinicFormData>({
    name: '',
    address: '',
    clinic_color: '#3b82f6'
  });

  // Computed signals
  protected clinicsList = this.clinicsService.all;
  protected isLoading = this.clinicsService.isLoading;

  /**
   * Abrir modal para crear nueva clínica
   */
  protected openNewClinicModal(): void {
    this.resetFormData();
    this.isNewClinicOpen.set(true);
  }

  /**
   * Cerrar modal de nueva clínica
   */
  protected closeNewClinicModal(): void {
    this.isNewClinicOpen.set(false);
    this.resetFormData();
  }

  /**
   * Crear nueva clínica
   */
  protected handleCreateClinic(): void {
    const data = this.formData();
    if (data.name.trim() && data.address.trim()) {
      this.clinicsService.createClinic(data);
      this.closeNewClinicModal();
    }
  }

  /**
   * Abrir modal para editar clínica
   */
  protected handleEditClinic(clinic: Clinic): void {
    this.editingClinic.set(clinic);
    this.formData.set({
      name: clinic.name,
      address: clinic.address,
      clinic_color: clinic.clinic_color
    });
  }

  /**
   * Cerrar modal de edición
   */
  protected closeEditModal(): void {
    this.editingClinic.set(null);
    this.resetFormData();
  }

  /**
   * Actualizar clínica
   */
  protected handleUpdateClinic(): void {
    const editing = this.editingClinic();
    const data = this.formData();
    
    if (editing && data.name.trim() && data.address.trim()) {
      this.clinicsService.updateClinic(editing.id, data);
      this.closeEditModal();
    }
  }

  /**
   * Abrir modal de confirmación de eliminación
   */
  protected openDeleteModal(clinic: Clinic): void {
    this.deletingClinic.set(clinic);
  }

  /**
   * Cerrar modal de eliminación
   */
  protected closeDeleteModal(): void {
    this.deletingClinic.set(null);
  }

  /**
   * Eliminar clínica
   */
  protected handleDeleteClinic(): void {
    const deleting = this.deletingClinic();
    if (deleting) {
      this.clinicsService.deleteClinic(deleting.id);
      this.closeDeleteModal();
    }
  }

  /**
   * Actualizar campo del formulario
   */
  protected updateFormField(field: keyof ClinicFormData, value: string): void {
    this.formData.update(data => ({ ...data, [field]: value }));
  }

  /**
   * Obtener ID de badge
   */
  protected getBadgeId(clinicId: string): string {
    return this.clinicsService.getBadgeId(clinicId);
  }

  /**
   * Resetear datos del formulario
   */
  private resetFormData(): void {
    this.formData.set({
      name: '',
      address: '',
      clinic_color: '#3b82f6'
    });
  }

  /**
   * Track by function para ngFor
   */
  protected trackByClinicId(index: number, clinic: Clinic): string {
    return clinic.id;
  }
}