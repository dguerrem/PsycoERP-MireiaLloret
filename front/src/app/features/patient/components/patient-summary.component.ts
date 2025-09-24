import {
  Component,
  ChangeDetectionStrategy,
  Input,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../shared/models/patient.model';
import { Session, Invoice, Bonus } from '../../../shared/models/patient-detail.model';

/**
 * Patient Summary Component
 *
 * Displays summary information for a patient including:
 * - Basic patient data
 * - Session statistics
 * - Session history
 * - Billing information
 */
@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientSummaryComponent {
  @Input() patient!: Patient;
  @Input() sessions: Session[] = [];
  @Input() invoices: Invoice[] = [];
  @Input() bonuses: Bonus[] = [];
  @Input() sessionStats = { completed: 0, scheduled: 0, cancelled: 0 };
  @Input() billingInfo = { totalSpent: 0, invoicesIssued: 0 };
  @Input() sessionType = 'Presencial';


  readonly completedSessions = computed(() => this.sessionStats.completed);

  readonly scheduledSessions = computed(() => this.sessionStats.scheduled);

  readonly cancelledSessions = computed(() => this.sessionStats.cancelled);

  readonly totalSpent = computed(() => this.billingInfo.totalSpent);

  readonly recentSessions = computed(() => this.sessions.slice(0, 10));


  formatPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      'cash': 'Efectivo',
      'card': 'Tarjeta',
      'transfer': 'Transferencia',
      'bizum': 'Bizum',
      'pending': 'Pendiente'
    };
    return methods[method] || method;
  }

  getFullName(patient: Patient): string {
    return `${patient.first_name} ${patient.last_name}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("es-ES");
  }
}