import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExistingInvoice } from '../../models/billing.models';

/**
 * Componente de facturas existentes
 * Muestra el listado de facturas ya generadas con filtros
 */
@Component({
  selector: 'app-existing-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './existing-invoices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingInvoicesComponent {
  /**
   * Mes seleccionado para filtrar facturas existentes
   */
  @Input({ required: true }) existingMonth!: number;

  /**
   * Año seleccionado para filtrar facturas existentes
   */
  @Input({ required: true }) existingYear!: number;

  /**
   * Array con los nombres de los meses
   */
  @Input({ required: true }) monthNames!: string[];

  /**
   * Array con los años disponibles
   */
  @Input({ required: true }) years!: number[];

  /**
   * Facturas existentes
   */
  @Input({ required: true }) existingInvoices!: ExistingInvoice[];

  /**
   * Estado de carga de facturas existentes
   */
  @Input({ required: true }) isLoadingExisting!: boolean;

  /**
   * Evento emitido cuando cambia el mes seleccionado
   */
  @Output() monthChange = new EventEmitter<number>();

  /**
   * Evento emitido cuando cambia el año seleccionado
   */
  @Output() yearChange = new EventEmitter<number>();

  /**
   * Evento emitido cuando se solicita vista previa de una factura
   */
  @Output() previewInvoice = new EventEmitter<ExistingInvoice>();

  // Filtros locales
  existingInvoiceNumberFilter = signal('');
  existingDateFilter = signal('');
  existingPatientFilter = signal('');
  existingDniFilter = signal('');

  /**
   * Facturas filtradas según los criterios de búsqueda
   */
  filteredExistingInvoices = computed(() => {
    const invoices = this.existingInvoices;
    const invoiceNumberFilter = this.existingInvoiceNumberFilter().toLowerCase();
    const dateFilter = this.existingDateFilter().toLowerCase();
    const patientFilter = this.existingPatientFilter().toLowerCase();
    const dniFilter = this.existingDniFilter().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesInvoiceNumber = invoice.invoice_number
        .toLowerCase()
        .includes(invoiceNumberFilter);
      const matchesDate = invoice.invoice_date
        .toLowerCase()
        .includes(dateFilter);
      const matchesPatient = invoice.patient_full_name
        .toLowerCase()
        .includes(patientFilter);
      const matchesDni = invoice.dni.toLowerCase().includes(dniFilter);

      return (
        matchesInvoiceNumber && matchesDate && matchesPatient && matchesDni
      );
    });
  });

  /**
   * Maneja el cambio de mes en el filtro
   */
  onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.monthChange.emit(parseInt(select.value));
  }

  /**
   * Maneja el cambio de año en el filtro
   */
  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.yearChange.emit(parseInt(select.value));
  }

  /**
   * Vista previa de una factura
   */
  onPreviewInvoice(invoice: ExistingInvoice): void {
    this.previewInvoice.emit(invoice);
  }

  /**
   * Formatea un número como moneda EUR
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  /**
   * Obtiene el nombre del mes seleccionado
   */
  getExistingMonthName(): string {
    return this.monthNames[this.existingMonth - 1];
  }
}
