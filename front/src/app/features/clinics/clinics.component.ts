import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicsService } from './services/clinics.service';
import { Clinic, ClinicFormData } from './models/clinic.model';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { ClinicaFormComponent } from './clinica-form/clinica-form.component';

@Component({
  selector: 'app-clinics',
  standalone: true,
  templateUrl: './clinics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent,
    ClinicaFormComponent
  ]
})
export class ClinicsComponent {

  // Services
  private clinicsService = inject(ClinicsService);

  // State signals
  protected showCreateForm = signal(false);
  protected editingClinica = signal<Clinic | null>(null);
  protected deletingClinic = signal<Clinic | null>(null);

  // Computed signals
  protected clinicsList = this.clinicsService.all;
  protected isLoading = this.clinicsService.isLoading;
  protected showForm = computed(() => this.showCreateForm() || this.editingClinica() !== null);

  /**
   * Abrir modal para crear nueva clínica
   */
  protected openCreateForm(): void {
    this.editingClinica.set(null);
    this.showCreateForm.set(true);
  }

  /**
   * Abrir modal para editar clínica
   */
  protected openEditForm(clinic: Clinic): void {
    this.showCreateForm.set(false);
    this.editingClinica.set(clinic);
  }

  /**
   * Cerrar modal de formulario
   */
  protected closeForm(): void {
    this.showCreateForm.set(false);
    this.editingClinica.set(null);
  }

  /**
   * Manejar guardado del formulario (crear/editar)
   */
  protected handleSave(clinicData: Clinic | ClinicFormData): void {
    const editing = this.editingClinica();
    
    if (editing) {
      // Editar clínica existente
      this.clinicsService.updateClinic(editing.id, clinicData as ClinicFormData);
    } else {
      // Crear nueva clínica
      this.clinicsService.createClinic(clinicData as ClinicFormData);
    }
    
    this.closeForm();
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
   * Obtener ID de badge
   */
  protected getBadgeId(clinicId: string): string {
    return this.clinicsService.getBadgeId(clinicId);
  }


  /**
   * Track by function para ngFor
   */
  protected trackByClinicId(index: number, clinic: Clinic): string {
    return clinic.id;
  }
}