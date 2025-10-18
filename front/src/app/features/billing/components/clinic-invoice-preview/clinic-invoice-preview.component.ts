import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';

export interface ClinicInvoicePreviewData {
  clinic_id: number;
  clinic_name: string;
  sessions_count: number;
  total_net: number;
  total_net_with_irpf: number;
  invoice_number: string;
  invoice_date: string;
}

/**
 * Componente de vista previa de factura de clínica
 * Muestra un resumen simplificado de la factura antes de generarla
 */
@Component({
  selector: 'app-clinic-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinic-invoice-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicInvoicePreviewComponent {
  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) clinicInvoiceData!: ClinicInvoicePreviewData | null;
  @Input({ required: true }) userData!: User | null;

  @Output() close = new EventEmitter<void>();

  /**
   * Formatea un número como moneda
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  /**
   * Maneja el cierre del modal
   */
  onClose() {
    this.close.emit();
  }

  /**
   * Previene la propagación del evento de clic en el contenedor interno
   */
  onContainerClick(event: Event) {
    event.stopPropagation();
  }
}
