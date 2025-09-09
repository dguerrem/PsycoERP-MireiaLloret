import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../shared/models/patient.model';
import { PatientsService } from './services/patients.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  templateUrl: './patient.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent,
    SectionHeaderComponent,
    PatientsListComponent,
    PaginationComponent,
  ],
})
export class PatientComponent implements OnInit {
  // Services
  private patientsService = inject(PatientsService);

  // State signals
  showCreateForm = signal(false);
  editingPatient = signal<Patient | null>(null);
  deletingPatient = signal<Patient | null>(null);

  // Computed signals
  patientsList = this.patientsService.all;
  isLoading = this.patientsService.loading;
  paginationData = this.patientsService.pagination;
  showForm = computed(
    () => this.showCreateForm() || this.editingPatient() !== null
  );

  ngOnInit() {
    // Data is loaded automatically by the service constructor
  }

  /**
   * Abrir modal para crear nuevo paciente
   */
  openCreateForm(): void {
    this.editingPatient.set(null);
    this.showCreateForm.set(true);
  }

  /**
   * Abrir modal para editar paciente
   */
  openEditForm(patient: Patient): void {
    this.showCreateForm.set(false);
    this.editingPatient.set(patient);
  }

  /**
   * Cerrar modal de formulario
   */
  closeForm(): void {
    this.showCreateForm.set(false);
    this.editingPatient.set(null);
  }

  /**
   * Manejar guardado del formulario (crear/editar)
   */
  handleSave(patientData: Patient | Partial<Patient>): void {
    const editing = this.editingPatient();

    if (editing) {
      // Editar paciente existente
      this.patientsService.updatePatient(
        editing.id,
        patientData as Partial<Patient>
      );
    } else {
      // Crear nuevo paciente
      this.patientsService.createPatient(patientData as Partial<Patient>);
    }

    this.closeForm();
  }

  /**
   * Abrir modal de confirmación de eliminación
   */
  openDeleteModal(patient: Patient): void {
    this.deletingPatient.set(patient);
  }

  /**
   * Cerrar modal de eliminación
   */
  closeDeleteModal(): void {
    this.deletingPatient.set(null);
  }

  /**
   * Eliminar paciente
   */
  handleDeletePatient(): void {
    const deleting = this.deletingPatient();
    if (deleting) {
      this.patientsService.deletePatient(deleting.id);
      this.closeDeleteModal();
    }
  }

  /**
   * Manejar cambio de página
   */
  onPageChange(page: number): void {
    const perPage = this.paginationData()?.recordsPerPage || 10;
    this.patientsService.loadAndSetPatientsPaginated(page, perPage);
  }

  /**
   * Manejar cambio de tamaño de página
   */
  onPageSizeChange(size: number): void {
    this.patientsService.loadAndSetPatientsPaginated(1, size);
  }

  /**
   * Track by function para ngFor
   */
  trackByPatientId(index: number, patient: Patient): number {
    return patient?.id || index;
  }
}
