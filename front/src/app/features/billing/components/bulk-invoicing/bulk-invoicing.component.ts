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
import { FormsModule } from '@angular/forms';
import { PendingInvoice } from '../../models/billing.models';

/**
 * Componente de facturación masiva
 * Gestiona la selección y generación masiva de facturas para pacientes
 */
@Component({
  selector: 'app-bulk-invoicing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-invoicing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkInvoicingComponent {
  /**
   * Mes seleccionado para filtrar facturas pendientes
   */
  private _pendingMonth = signal<number>(0);
  @Input({ required: true })
  set pendingMonth(value: number) {
    this._pendingMonth.set(value);
  }
  get pendingMonth(): number {
    return this._pendingMonth();
  }

  /**
   * Año seleccionado para filtrar facturas pendientes
   */
  private _pendingYear = signal<number>(0);
  @Input({ required: true })
  set pendingYear(value: number) {
    this._pendingYear.set(value);
  }
  get pendingYear(): number {
    return this._pendingYear();
  }

  /**
   * Array con los nombres de los meses
   */
  @Input({ required: true }) monthNames!: string[];

  /**
   * Array con los años disponibles
   */
  @Input({ required: true }) years!: number[];

  /**
   * Facturas pendientes de generar
   */
  private _pendingInvoices = signal<PendingInvoice[]>([]);
  @Input({ required: true })
  set pendingInvoices(value: PendingInvoice[]) {
    this._pendingInvoices.set(value);
  }
  get pendingInvoices(): PendingInvoice[] {
    return this._pendingInvoices();
  }

  /**
   * Estado de carga de facturas pendientes
   */
  private _isLoadingPending = signal<boolean>(false);
  @Input({ required: true })
  set isLoadingPending(value: boolean) {
    this._isLoadingPending.set(value);
  }
  get isLoadingPending(): boolean {
    return this._isLoadingPending();
  }

  /**
   * Pacientes seleccionados (DNIs)
   */
  private _selectedPatients = signal<string[]>([]);
  @Input({ required: true })
  set selectedPatients(value: string[]) {
    this._selectedPatients.set(value);
  }
  get selectedPatients(): string[] {
    return this._selectedPatients();
  }

  /**
   * Prefijo para números de factura
   */
  @Input({ required: true }) invoicePrefix!: string;

  /**
   * Año para números de factura
   */
  @Input({ required: true }) invoiceYear!: number;

  /**
   * Próximo número de factura
   */
  @Input({ required: true }) invoiceNextNumber!: number;

  /**
   * Evento emitido cuando cambia el mes seleccionado
   */
  @Output() monthChange = new EventEmitter<number>();

  /**
   * Evento emitido cuando cambia el año seleccionado
   */
  @Output() yearChange = new EventEmitter<number>();

  /**
   * Evento emitido cuando se alterna la selección de un paciente
   */
  @Output() patientToggle = new EventEmitter<string>();

  /**
   * Evento emitido cuando se seleccionan/deseleccionan todos los pacientes
   */
  @Output() selectAllToggle = new EventEmitter<void>();

  /**
   * Evento emitido cuando se solicita generar facturas
   */
  @Output() generateInvoices = new EventEmitter<void>();

  /**
   * Evento emitido cuando se solicita vista previa de una factura
   */
  @Output() previewInvoice = new EventEmitter<PendingInvoice>();

  /**
   * Evento emitido cuando cambia el prefijo de factura
   */
  @Output() prefixChange = new EventEmitter<string>();

  /**
   * Evento emitido cuando cambia el año de factura
   */
  @Output() invoiceYearChange = new EventEmitter<number>();

  /**
   * Evento emitido cuando se valida el año de factura
   */
  @Output() invoiceYearValidate = new EventEmitter<void>();

  // Filtros locales
  pendingPatientFilter = signal('');
  pendingDniFilter = signal('');
  pendingEmailFilter = signal('');

  /**
   * Facturas filtradas según los criterios de búsqueda
   */
  filteredPendingInvoices = computed(() => {
    const invoices = this.pendingInvoices;
    const patientFilter = this.pendingPatientFilter().toLowerCase();
    const dniFilter = this.pendingDniFilter().toLowerCase();
    const emailFilter = this.pendingEmailFilter().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesPatient = invoice.patient_full_name
        .toLowerCase()
        .includes(patientFilter);
      const matchesDni = invoice.dni.toLowerCase().includes(dniFilter);
      const matchesEmail = invoice.email.toLowerCase().includes(emailFilter);

      return matchesPatient && matchesDni && matchesEmail;
    });
  });

  /**
   * Indica si todos los pacientes están seleccionados
   */
  allSelected = computed(
    () =>
      this.pendingInvoices.length > 0 &&
      this._selectedPatients().length === this.pendingInvoices.length
  );

  /**
   * Número de pacientes seleccionados
   */
  selectedCount = computed(() => this._selectedPatients().length);

  /**
   * Total de la cantidad seleccionada
   */
  totalSelectedAmount = computed(() => {
    const selected = this._selectedPatients();
    return this.pendingInvoices
      .filter((inv) => selected.includes(inv.dni))
      .reduce((sum, inv) => sum + inv.total_gross, 0);
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
   * Alterna la selección de un paciente
   */
  togglePatientSelection(dni: string): void {
    this.patientToggle.emit(dni);
  }

  /**
   * Selecciona o deselecciona todos los pacientes
   */
  selectAllPatients(): void {
    this.selectAllToggle.emit();
  }

  /**
   * Genera facturas masivas
   */
  onGenerateInvoices(): void {
    this.generateInvoices.emit();
  }

  /**
   * Vista previa de una factura
   */
  onPreviewInvoice(invoice: PendingInvoice): void {
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
  getPendingMonthName(): string {
    return this.monthNames[this.pendingMonth - 1];
  }

  /**
   * Formatea número con padding
   */
  padNumber(num: number, length: number = 4): string {
    return num.toString().padStart(length, '0');
  }

  /**
   * Actualiza el prefijo de factura
   */
  onPrefixChange(newPrefix: string): void {
    this.prefixChange.emit(newPrefix);
  }

  /**
   * Actualiza el año de factura
   */
  onInvoiceYearChange(newYear: number): void {
    this.invoiceYearChange.emit(newYear);
  }

  /**
   * Valida el año de factura
   */
  onInvoiceYearBlur(): void {
    this.invoiceYearValidate.emit();
  }
}
