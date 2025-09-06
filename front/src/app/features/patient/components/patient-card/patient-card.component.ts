import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../shared/models/patient.model';
import { PatientsService } from '../../services/patients.service';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  templateUrl: './patient-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PatientCardComponent {
  private patientsService = inject(PatientsService);

  @Input({ required: true }) patient!: Patient;

  @Output() onPatientClick = new EventEmitter<Patient>();

  /**
   * Get status color for badge
   */
  getStatusColor(status: string): string {
    return this.patientsService.getStatusColor(status);
  }

  /**
   * Get status label in Spanish
   */
  getStatusLabel(status: string): string {
    return this.patientsService.getStatusLabel(status);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return this.patientsService.formatDate(dateString);
  }

  /**
   * Capitalize session type
   */
  capitalizeSessionType(sessionType: string): string {
    return this.patientsService.capitalizeSessionType(sessionType);
  }
}