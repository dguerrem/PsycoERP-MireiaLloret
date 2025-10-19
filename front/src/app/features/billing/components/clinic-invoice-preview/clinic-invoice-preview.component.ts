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
  fiscal_name: string;
  cif: string;
  billing_address: string;
  sessions_count: number;
  total_net: number;
  total_net_with_irpf: number;
  invoice_number: string;
  invoice_date: string;
  concept: string;
  total: number;
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
  @Input({ required: true })
  clinicInvoiceData!: ClinicInvoicePreviewData | null;
  @Input({ required: true }) userData!: User | null;

  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

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
   * Maneja la descarga del PDF
   */
  onDownload() {
    this.download.emit();
  }

  /**
   * Previene la propagación del evento de clic en el contenedor interno
   */
  onContainerClick(event: Event) {
    event.stopPropagation();
  }
 // Función para calcular la retención
getRetentionAmount(): number {
  if (this.clinicInvoiceData?.total && this.userData?.irpf) {
    const price = this.clinicInvoiceData.total;
    const irpfRate = +this.userData.irpf / 100;

    const retention = price * irpfRate;

    return retention;
  }
  return 0; // Devuelve 0 si faltan datos
}
}
