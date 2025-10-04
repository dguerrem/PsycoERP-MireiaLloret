import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from './services/billing.service';
import { InvoiceKPIs, PendingInvoice, ExistingInvoice } from './models/billing.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

/**
 * Componente de facturación
 * Gestiona generación masiva de facturas y visualización de KPIs
 */
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingComponent implements OnInit {
  private billingService = inject(BillingService);

  // Signals para estado del componente
  activeTab = signal<'bulk' | 'existing'>('bulk');

  // Filtros para KPIs (Período de Análisis)
  kpiMonth = signal(new Date().getMonth() + 1);
  kpiYear = signal(new Date().getFullYear());

  // Filtros para Facturas Pendientes
  pendingMonth = signal(new Date().getMonth() + 1);
  pendingYear = signal(new Date().getFullYear());

  kpis = signal<InvoiceKPIs | null>(null);
  pendingInvoices = signal<PendingInvoice[]>([]);
  existingInvoices = signal<ExistingInvoice[]>([]);
  selectedPatients = signal<string[]>([]);

  // Numeración de facturas
  invoiceBaseNumber = signal('FAC-2025');
  invoiceNextNumber = signal(6);

  isLoadingKPIs = signal(false);
  isLoadingPending = signal(false);
  isLoadingExisting = signal(false);

  // Computed signals
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  years = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  });

  allSelected = computed(() =>
    this.pendingInvoices().length > 0 &&
    this.selectedPatients().length === this.pendingInvoices().length
  );

  selectedCount = computed(() => this.selectedPatients().length);

  totalSelectedAmount = computed(() => {
    const selected = this.selectedPatients();
    return this.pendingInvoices()
      .filter(inv => selected.includes(inv.dni))
      .reduce((sum, inv) => sum + inv.total_gross, 0);
  });

  ngOnInit() {
    this.loadKPIs();
    this.loadPendingInvoices();
  }

  /**
   * Carga los KPIs de facturación
   */
  loadKPIs() {
    this.isLoadingKPIs.set(true);
    this.billingService.getKPIs(this.kpiMonth(), this.kpiYear())
      .subscribe({
        next: (response) => {
          this.kpis.set(response.data);
          this.isLoadingKPIs.set(false);
        },
        error: () => {
          this.isLoadingKPIs.set(false);
        }
      });
  }

  /**
   * Carga las facturas pendientes
   */
  loadPendingInvoices() {
    this.isLoadingPending.set(true);
    this.billingService.getPendingInvoices(this.pendingMonth(), this.pendingYear())
      .subscribe({
        next: (response) => {
          this.pendingInvoices.set(response.data.pending_invoices);
          this.isLoadingPending.set(false);
          // Limpiar selección al cambiar filtros
          this.selectedPatients.set([]);
        },
        error: () => {
          this.isLoadingPending.set(false);
        }
      });
  }

  /**
   * Carga las facturas existentes
   */
  loadExistingInvoices() {
    this.isLoadingExisting.set(true);
    this.billingService.getExistingInvoices(this.pendingMonth(), this.pendingYear())
      .subscribe({
        next: (response) => {
          this.existingInvoices.set(response.data.invoices);
          this.isLoadingExisting.set(false);
        },
        error: () => {
          this.isLoadingExisting.set(false);
        }
      });
  }

  /**
   * Maneja el cambio de mes en el filtro de KPIs
   */
  onKpiMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.kpiMonth.set(parseInt(select.value));
    this.loadKPIs();
  }

  /**
   * Maneja el cambio de año en el filtro de KPIs
   */
  onKpiYearChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.kpiYear.set(parseInt(select.value));
    this.loadKPIs();
  }

  /**
   * Maneja el cambio de mes en el filtro de Facturas Pendientes
   */
  onPendingMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pendingMonth.set(parseInt(select.value));
    this.loadPendingInvoices();
  }

  /**
   * Maneja el cambio de año en el filtro de Facturas Pendientes
   */
  onPendingYearChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pendingYear.set(parseInt(select.value));
    this.loadPendingInvoices();
  }

  /**
   * Cambia entre tabs
   */
  onTabChange(tab: 'bulk' | 'existing') {
    this.activeTab.set(tab);
    if (tab === 'existing' && this.existingInvoices().length === 0) {
      this.loadExistingInvoices();
    }
  }

  /**
   * Alterna la selección de un paciente
   */
  togglePatientSelection(dni: string) {
    const current = this.selectedPatients();
    if (current.includes(dni)) {
      this.selectedPatients.set(current.filter(d => d !== dni));
    } else {
      this.selectedPatients.set([...current, dni]);
    }
  }

  /**
   * Selecciona o deselecciona todos los pacientes
   */
  selectAllPatients() {
    if (this.allSelected()) {
      this.selectedPatients.set([]);
    } else {
      this.selectedPatients.set(this.pendingInvoices().map(inv => inv.dni));
    }
  }

  /**
   * Genera facturas masivas para los pacientes seleccionados
   */
  generateBulkInvoices() {
    const selected = this.selectedPatients();
    if (selected.length === 0) {
      return;
    }

    // TODO: Implementar confirmación y generación real
    console.log('Generando facturas para:', selected);
    console.log('Total a facturar:', this.totalSelectedAmount());

    this.billingService.generateBulkInvoices(
      selected,
      this.pendingMonth(),
      this.pendingYear()
    ).subscribe({
      next: (response) => {
        console.log('Facturas generadas:', response);
        // Recargar datos después de generar
        this.loadKPIs();
        this.loadPendingInvoices();
        this.loadExistingInvoices();
      },
      error: (error) => {
        console.error('Error al generar facturas:', error);
      }
    });
  }

  /**
   * Formatea un número como moneda
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  /**
   * Obtiene el nombre del mes de KPIs
   */
  getKpiMonthName(): string {
    return this.monthNames[this.kpiMonth() - 1];
  }

  /**
   * Obtiene el nombre del mes de facturas pendientes
   */
  getPendingMonthName(): string {
    return this.monthNames[this.pendingMonth() - 1];
  }

  /**
   * Formatea número con padding
   */
  padNumber(num: number, length: number = 4): string {
    return num.toString().padStart(length, '0');
  }
}
