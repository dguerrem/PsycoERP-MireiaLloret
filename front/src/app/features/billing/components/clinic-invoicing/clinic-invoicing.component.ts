import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicInvoiceData } from '../../models/billing.models';

/**
 * Componente de facturación de clínicas
 * Gestiona la selección y generación de facturas para clínicas
 */
@Component({
  selector: 'app-clinic-invoicing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clinic-invoicing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicInvoicingComponent {
  /**
   * Mes seleccionado para filtrar facturas de clínicas
   */
  @Input({ required: true }) clinicsMonth!: number;

  /**
   * Año seleccionado para filtrar facturas de clínicas
   */
  @Input({ required: true }) clinicsYear!: number;

  /**
   * Array con los nombres de los meses
   */
  @Input({ required: true }) monthNames!: string[];

  /**
   * Array con los años disponibles
   */
  @Input({ required: true }) years!: number[];

  /**
   * Facturas pendientes de clínicas
   */
  @Input({ required: true }) clinicInvoices!: ClinicInvoiceData[];

  /**
   * Estado de carga de facturas de clínicas
   */
  @Input({ required: true }) isLoadingClinics!: boolean;

  /**
   * ID de la clínica seleccionada
   */
  @Input({ required: true }) selectedClinicId!: number | null;

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
   * Evento emitido cuando se selecciona una clínica
   */
  @Output() clinicSelect = new EventEmitter<number>();

  /**
   * Evento emitido cuando se solicita generar factura de clínica
   */
  @Output() generateInvoice = new EventEmitter<void>();

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
   * Selecciona una clínica
   */
  selectClinic(clinicId: number): void {
    this.clinicSelect.emit(clinicId);
  }

  /**
   * Genera factura de clínica
   */
  onGenerateInvoice(): void {
    this.generateInvoice.emit();
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
  getClinicsMonthName(): string {
    return this.monthNames[this.clinicsMonth - 1];
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
