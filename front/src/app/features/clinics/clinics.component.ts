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
import { ClinicsService } from './services/clinics.service';
import { Clinic } from './models/clinic.model';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ClinicsListComponent } from './components/clinics-list/clinics-list.component';
import { ClinicFormComponent } from './components/clinic-form/clinic-form.component';

type TabType = 'active' | 'inactive';

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
    PaginationComponent,
  ],
})
export class ClinicsComponent implements OnInit {
  // Services
  private clinicsService = inject(ClinicsService);

  // State signals
  showCreateForm = signal(false);
  editingClinica = signal<Clinic | null>(null);
  deletingClinic = signal<Clinic | null>(null);
  restoringClinic = signal<Clinic | null>(null);
  activeTab = signal<TabType>('active');

  // Separate state for each tab
  activeClinics = signal<Clinic[]>([]);
  inactiveClinics = signal<Clinic[]>([]);

  // Separate pagination states
  activePagination = signal<any>(null);
  inactivePagination = signal<any>(null);

  // Separate counts
  activeClinicsCount = signal(0);
  inactiveClinicsCount = signal(0);

  // Computed signals based on active tab
  clinicsList = computed(() => {
    return this.activeTab() === 'active' ? this.activeClinics() : this.inactiveClinics();
  });

  paginationData = computed(() => {
    return this.activeTab() === 'active' ? this.activePagination() : this.inactivePagination();
  });

  showForm = computed(
    () => this.showCreateForm() || this.editingClinica() !== null
  );

  ngOnInit() {
    // Load data for both tabs to show correct counts
    this.loadActiveClinics(1, 12);
    this.loadInactiveClinics(1, 12);
  }

  /**
   * Load active clinics with pagination
   */
  private loadActiveClinics(page: number, perPage: number): void {
    this.clinicsService.loadActiveClinics(page, perPage).subscribe({
      next: (response) => {
        this.activeClinics.set(response.data);
        this.activePagination.set(response.pagination);
        this.activeClinicsCount.set(response.pagination?.totalRecords || 0);
      },
      error: () => {
        // Error handling is managed by error interceptor
      },
    });
  }

  /**
   * Load inactive clinics with pagination
   */
  private loadInactiveClinics(page: number, perPage: number): void {
    this.clinicsService.loadInactiveClinics(page, perPage).subscribe({
      next: (response) => {
        this.inactiveClinics.set(response.data);
        this.inactivePagination.set(response.pagination);
        this.inactiveClinicsCount.set(response.pagination?.totalRecords || 0);
      },
      error: () => {
        // Error handling is managed by error interceptor
      },
    });
  }

  /**
   * Change active tab
   */
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  /**
   * Get CSS classes for tabs
   */
  getTabClasses(tab: TabType): string {
    const baseClasses = 'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] flex-1 justify-center rounded-md border border-transparent px-2 py-1 whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 flex items-center gap-2 text-sm font-medium';

    return this.activeTab() === tab
      ? `${baseClasses} bg-background text-foreground shadow-sm`
      : baseClasses;
  }

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
      this.clinicsService.updateClinic(editing.id!, clinicData as Clinic).subscribe({
        next: () => {
          this.reloadCurrentTab();
        }
      });
    } else {
      // Crear nueva clínica
      this.clinicsService.createClinic(clinicData as Clinic).subscribe({
        next: () => {
          // Reload active clinics (new clinics go to active)
          const activePag = this.activePagination();
          this.loadActiveClinics(activePag?.currentPage || 1, activePag?.recordsPerPage || 12);
        }
      });
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
      this.clinicsService.deleteClinic(deleting.id!).subscribe({
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
  openRestoreModal(clinic: Clinic): void {
    this.restoringClinic.set(clinic);
  }

  /**
   * Cerrar modal de restauración
   */
  closeRestoreModal(): void {
    this.restoringClinic.set(null);
  }

  /**
   * Restaurar clínica
   */
  handleRestoreClinic(): void {
    const restoring = this.restoringClinic();
    if (restoring) {
      // TODO: Implement restore functionality in service
      console.log('Restaurando clínica:', restoring);

      // Simulate restore by changing status to active
      const updatedClinic = { ...restoring, status: 'active' };
      this.clinicsService.updateClinic(restoring.id!, updatedClinic).subscribe({
        next: () => {
          this.reloadBothTabs();
        }
      });

      this.closeRestoreModal();
    }
  }

  /**
   * Reload current tab data
   */
  private reloadCurrentTab(): void {
    const tab = this.activeTab();
    if (tab === 'active') {
      const activePag = this.activePagination();
      this.loadActiveClinics(activePag?.currentPage || 1, activePag?.recordsPerPage || 12);
    } else {
      const inactivePag = this.inactivePagination();
      this.loadInactiveClinics(inactivePag?.currentPage || 1, inactivePag?.recordsPerPage || 12);
    }
  }

  /**
   * Reload data for both tabs to update counters
   */
  private reloadBothTabs(): void {
    const activePag = this.activePagination();
    const inactivePag = this.inactivePagination();

    this.loadActiveClinics(activePag?.currentPage || 1, activePag?.recordsPerPage || 12);
    this.loadInactiveClinics(inactivePag?.currentPage || 1, inactivePag?.recordsPerPage || 12);
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    const tab = this.activeTab();
    const perPage = this.paginationData()?.recordsPerPage || 12;

    if (tab === 'active') {
      this.loadActiveClinics(page, perPage);
    } else {
      this.loadInactiveClinics(page, perPage);
    }
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(size: number): void {
    const tab = this.activeTab();

    if (tab === 'active') {
      this.loadActiveClinics(1, size);
    } else {
      this.loadInactiveClinics(1, size);
    }
  }

  /**
   * Track by function para ngFor
   */
  trackByClinicId(index: number, clinic: Clinic): string {
    return clinic?.id || index.toString();
  }
}
