import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-card',
  standalone: true,
  templateUrl: './clinic-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ClinicCardComponent {
  @Input({ required: true }) clinic!: Clinic;
  @Input() isDeletedView: boolean = false;

  @Output() onEdit = new EventEmitter<Clinic>();
  @Output() onDelete = new EventEmitter<Clinic>();
  @Output() onRestore = new EventEmitter<Clinic>();

  /**
   * Get status color for badge
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status label in Spanish
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      default:
        return status;
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  }
}