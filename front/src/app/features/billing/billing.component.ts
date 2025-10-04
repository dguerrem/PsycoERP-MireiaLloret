import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from './services/billing.service';
import { InvoiceKPIs, PendingInvoice, ExistingInvoice } from './models/billing.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ReusableModalComponent } from '../../shared/components/reusable-modal/reusable-modal.component';

interface InvoiceToGenerate {
  patient_full_name: string;
  dni: string;
  email: string;
  pending_sessions_count: number;
  total_gross: number;
  invoice_number: string;
  invoice_date: string;
}

/**
 * Componente de facturación
 * Gestiona generación masiva de facturas y visualización de KPIs
 */
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeaderComponent, ReusableModalComponent],
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

  // Modal state
  isModalOpen = signal(false);
  invoicesToGenerate = signal<InvoiceToGenerate[]>([]);

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
   * Abre el modal con las facturas a generar
   */
  generateBulkInvoices() {
    const selected = this.selectedPatients();
    if (selected.length === 0) {
      return;
    }

    // Obtener datos de las facturas seleccionadas
    const selectedInvoices = this.pendingInvoices().filter(inv =>
      selected.includes(inv.dni)
    );

    // Preparar datos para el modal
    const invoices: InvoiceToGenerate[] = selectedInvoices.map((inv, index) => ({
      patient_full_name: inv.patient_full_name,
      dni: inv.dni,
      email: inv.email,
      pending_sessions_count: inv.pending_sessions_count,
      total_gross: inv.total_gross,
      invoice_number: `${this.invoiceBaseNumber()}-${this.padNumber(this.invoiceNextNumber() + index)}`,
      invoice_date: new Date().toISOString().split('T')[0]
    }));

    this.invoicesToGenerate.set(invoices);
    this.isModalOpen.set(true);
  }

  /**
   * Cierra el modal de generación
   */
  closeModal() {
    this.isModalOpen.set(false);
    this.invoicesToGenerate.set([]);
  }

  /**
   * Confirma y genera las facturas desde el modal
   */
  confirmGenerateInvoices() {
    // TODO: Implementar generación real con los datos del modal
    console.log('Generando facturas:', this.invoicesToGenerate());

    this.billingService.generateBulkInvoices(
      this.selectedPatients(),
      this.pendingMonth(),
      this.pendingYear()
    ).subscribe({
      next: (response) => {
        console.log('Facturas generadas:', response);
        this.closeModal();
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
   * Actualiza el número de factura de un paciente
   */
  updateInvoiceNumber(dni: string, newNumber: string) {
    const invoices = this.invoicesToGenerate();
    const index = invoices.findIndex(inv => inv.dni === dni);
    if (index !== -1) {
      const updated = [...invoices];
      updated[index] = { ...updated[index], invoice_number: newNumber };
      this.invoicesToGenerate.set(updated);
    }
  }

  /**
   * Actualiza la fecha de emisión de un paciente
   */
  updateInvoiceDate(dni: string, newDate: string) {
    const invoices = this.invoicesToGenerate();
    const index = invoices.findIndex(inv => inv.dni === dni);
    if (index !== -1) {
      const updated = [...invoices];
      updated[index] = { ...updated[index], invoice_date: newDate };
      this.invoicesToGenerate.set(updated);
    }
  }

  /**
   * Vista previa de la factura
   */
  previewInvoice(dni: string) {
    const invoice = this.invoicesToGenerate().find(inv => inv.dni === dni);
    if (invoice) {
      // TODO: Implementar vista previa de la factura
      console.log('Vista previa de factura:', invoice);
    }
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
