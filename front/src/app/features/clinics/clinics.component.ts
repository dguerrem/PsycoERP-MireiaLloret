import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicsService } from './services/clinics.service';
import { Clinic } from './models/clinic.model';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ClinicsListComponent } from './components/clinics-list/clinics-list.component';
import { ClinicFormComponent } from './components/clinic-form/clinic-form.component';

@Component({
  selector: 'app-clinics',
  standalone: true,
  templateUrl: './clinics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent,
    ClinicFormComponent,
    SectionHeaderComponent,
    ClinicsListComponent,
  ],
})
export class ClinicsComponent {
  // Services
  private clinicsService = inject(ClinicsService);

  // State signals
  showCreateForm = signal(false);
  editingClinica = signal<Clinic | null>(null);
  deletingClinic = signal<Clinic | null>(null);

  // Computed signals
  clinicsList = this.clinicsService.all;
  showForm = computed(
    () => this.showCreateForm() || this.editingClinica() !== null
  );

  /**
   * Abrir modal para crear nueva clínica
   */
  openCreateForm(): void {
    this.editingClinica.set(null);
    this.showCreateForm.set(true);
  }

  /**
   * Abrir modal para editar clínica
   */
  openEditForm(clinic: Clinic): void {
    this.showCreateForm.set(false);
    this.editingClinica.set(clinic);
  }

  /**
   * Cerrar modal de formulario
   */
  closeForm(): void {
    this.showCreateForm.set(false);
    this.editingClinica.set(null);
  }

  /**
   * Manejar guardado del formulario (crear/editar)
   */
  handleSave(clinicData: Clinic): void {
    const editing = this.editingClinica();

    if (editing) {
      // Editar clínica existente
      this.clinicsService.updateClinic(editing.id!, clinicData as Clinic);
    } else {
      // Crear nueva clínica
      this.clinicsService.createClinic(clinicData as Clinic);
    }

    this.closeForm();
  }

  /**
   * Abrir modal de confirmación de eliminación
   */
  openDeleteModal(clinic: Clinic): void {
    this.deletingClinic.set(clinic);
  }

  /**
   * Cerrar modal de eliminación
   */
  closeDeleteModal(): void {
    this.deletingClinic.set(null);
  }

  /**
   * Eliminar clínica
   */
  handleDeleteClinic(): void {
    const deleting = this.deletingClinic();
    if (deleting) {
      this.clinicsService.deleteClinic(deleting.id!);
      this.closeDeleteModal();
    }
  }

  /**
   * Track by function para ngFor
   */
  trackByClinicId(index: number, clinic: Clinic): string {
    return clinic?.id || index.toString();
  }
}
