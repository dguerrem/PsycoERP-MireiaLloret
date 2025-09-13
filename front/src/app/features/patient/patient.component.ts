import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../shared/models/patient.model';
import { PatientsService } from './services/patients.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';

type TabType = 'active' | 'inactive';

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
    PatientFormComponent,
  ],
})
export class PatientComponent implements OnInit {
  // Services
  private patientsService = inject(PatientsService);
  private router = inject(Router);

  // State signals
  showCreateForm = signal(false);
  editingPatient = signal<Patient | null>(null);
  deletingPatient = signal<Patient | null>(null);
  restoringPatient = signal<Patient | null>(null);
  activeTab = signal<TabType>('active');

  // Separate state for each tab
  activePatients = signal<Patient[]>([]);
  deletedPatients = signal<Patient[]>([]);

  // Loading is handled globally by LoadingInterceptor - no local loading needed

  // Separate pagination states
  activePagination = signal<any>(null);
  deletedPagination = signal<any>(null);

  // Separate counts
  activePatientsCount = signal(0);
  deletedPatientsCount = signal(0);

  // Computed signals based on active tab
  patientsList = computed(() => {
    return this.activeTab() === 'active' ? this.activePatients() : this.deletedPatients();
  });

  paginationData = computed(() => {
    return this.activeTab() === 'active' ? this.activePagination() : this.deletedPagination();
  });

  showForm = computed(
    () => this.showCreateForm() || this.editingPatient() !== null
  );

  constructor() {
    // No effect needed - load data explicitly
  }

  ngOnInit() {
    // Load data for both tabs to show correct counts
    this.loadActivePatients(1, 12);
    this.loadDeletedPatients(1, 12);
  }

  /**
   * Cargar pacientes activos
   */
  private loadActivePatients(page: number, perPage: number): void {
    this.patientsService.loadActivePatientsPaginated(page, perPage).subscribe({
      next: (response) => {
        this.activePatients.set(response.data);
        this.activePagination.set(response.pagination);
        this.activePatientsCount.set(response.pagination?.totalRecords || 0);
      },
      error: () => {
        // Error handling is managed by error interceptor
      },
    });
  }

  /**
   * Cargar pacientes eliminados
   */
  private loadDeletedPatients(page: number, perPage: number): void {
    this.patientsService.loadDeletedPatientsPaginated(page, perPage).subscribe({
      next: (response) => {
        this.deletedPatients.set(response.data);
        this.deletedPagination.set(response.pagination);
        this.deletedPatientsCount.set(response.pagination?.totalRecords || 0);
      },
      error: () => {
        // Error handling is managed by error interceptor
      },
    });
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
  handleSave(patientData: Patient): void {
    const editing = this.editingPatient();

    if (editing) {
      // Editar paciente existente
      this.patientsService.update(editing.id!, patientData).subscribe({
        next: () => {
          // Reload current tab data
          this.reloadCurrentTab();
        }
      });
    } else {
      // Crear nuevo paciente
      this.patientsService.create(patientData).subscribe({
        next: () => {
          // Reload active patients (new patients go to active)
          const activePag = this.activePagination();
          this.loadActivePatients(activePag?.currentPage || 1, activePag?.recordsPerPage || 10);
        }
      });
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
      this.patientsService.delete(deleting.id!).subscribe({
        next: () => {
          // Reload both tabs to update counts
          this.reloadBothTabs();
        }
      });
      this.closeDeleteModal();
    }
  }

  /**
   * Abrir modal de confirmación de restauración
   */
  openRestoreModal(patient: Patient): void {
    this.restoringPatient.set(patient);
  }

  /**
   * Cerrar modal de restauración
   */
  closeRestoreModal(): void {
    this.restoringPatient.set(null);
  }

  /**
   * Restaurar paciente (implementar según tu API)
   */
  handleRestorePatient(): void {
    const restoring = this.restoringPatient();
    if (restoring) {
      // TODO: Implementar llamada al endpoint de restauración
      // Por ahora simulo la llamada con un timeout
      console.log('Restaurando paciente:', restoring);

      // Simular respuesta exitosa
      setTimeout(() => {
        // Reload both tabs to update counts
        this.reloadBothTabs();
        this.closeRestoreModal();
      }, 500);
    }
  }

  /**
   * Recargar datos de la pestaña actual
   */
  private reloadCurrentTab(): void {
    const tab = this.activeTab();
    if (tab === 'active') {
      const activePag = this.activePagination();
      this.loadActivePatients(activePag?.currentPage || 1, activePag?.recordsPerPage || 10);
    } else {
      const deletedPag = this.deletedPagination();
      this.loadDeletedPatients(deletedPag?.currentPage || 1, deletedPag?.recordsPerPage || 10);
    }
  }

  /**
   * Recargar datos de ambas pestañas para actualizar contadores
   */
  private reloadBothTabs(): void {
    const activePag = this.activePagination();
    const deletedPag = this.deletedPagination();

    this.loadActivePatients(activePag?.currentPage || 1, activePag?.recordsPerPage || 10);
    this.loadDeletedPatients(deletedPag?.currentPage || 1, deletedPag?.recordsPerPage || 10);
  }

  /**
   * Cambiar pestaña activa
   */
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
    // No need to load data - both tabs are loaded on init
  }

  /**
   * Obtener clases CSS para las pestañas
   */
  getTabClasses(tab: TabType): string {
    const baseClasses = 'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] flex-1 justify-center rounded-md border border-transparent px-2 py-1 whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 flex items-center gap-2 text-sm font-medium';

    return this.activeTab() === tab
      ? `${baseClasses} bg-background text-foreground shadow-sm`
      : baseClasses;
  }

  /**
   * Manejar cambio de página
   */
  onPageChange(page: number): void {
    const tab = this.activeTab();
    const perPage = this.paginationData()?.recordsPerPage || 10;

    if (tab === 'active') {
      this.loadActivePatients(page, perPage);
    } else {
      this.loadDeletedPatients(page, perPage);
    }
  }

  /**
   * Manejar cambio de tamaño de página
   */
  onPageSizeChange(size: number): void {
    const tab = this.activeTab();

    if (tab === 'active') {
      this.loadActivePatients(1, size);
    } else {
      this.loadDeletedPatients(1, size);
    }
  }

  /**
   * Navigate to patient detail
   */
  navigateToDetail(patient: Patient): void {
    this.router.navigate(['/patient', patient.id]);
  }

  /**
   * Track by function para ngFor
   */
  trackByPatientId(index: number, patient: Patient): number {
    return patient?.id || index;
  }
}
