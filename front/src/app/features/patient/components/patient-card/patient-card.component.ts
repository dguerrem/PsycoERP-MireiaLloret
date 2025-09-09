import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  templateUrl: './patient-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PatientCardComponent {
  @Input({ required: true }) patient!: Patient;

  @Output() onEdit = new EventEmitter<Patient>();
  @Output() onDelete = new EventEmitter<Patient>();

  /**
   * Get status color for badge
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'discharged':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
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
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'discharged':
        return 'Alta';
      case 'on-hold':
        return 'En Pausa';
      default:
        return status;
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Capitalize session type
   */
  capitalizeSessionType(sessionType: string): string {
    const typeMap: { [key: string]: string } = {
      'individual': 'Individual',
      'couples': 'Pareja',
      'family': 'Familiar',
      'group': 'Grupo'
    };
    return typeMap[sessionType] || sessionType;
  }
}