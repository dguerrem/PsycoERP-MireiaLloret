import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Patient } from '../../shared/models/patient.model';
import { PatientsService } from './services/patients.service';

/**
 * Patients module component - Exact replica of React PatientsModule
 * 
 * Features:
 * - Patient grid with cards
 * - Search functionality
 * - Status filtering
 * - Navigation to patient details
 * - Responsive design matching React component
 */
@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientComponent {
  private patientsService = inject(PatientsService);
  private router = inject(Router);

  // Expose service signals to template
  readonly filteredPatients = this.patientsService.filteredPatients;
  readonly searchTerm = this.patientsService.currentSearchTerm;
  readonly statusFilter = this.patientsService.currentStatusFilter;

  /**
   * Handle search input change
   */
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.patientsService.setSearchTerm(target.value);
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.patientsService.setStatusFilter(target.value);
  }

  /**
   * Navigate to patient details
   */
  onPatientClick(patient: Patient): void {
    this.patientsService.selectPatient(patient);
    this.router.navigate(['/patient', patient.id]);
  }

  /**
   * Handle new patient button click
   */
  onNewPatientClick(): void {
    this.router.navigate(['/patient', 'nuevo']);
  }

  /**
   * Handle filters button click
   */
  onFiltersClick(): void {
    // TODO: Implement advanced filters modal
    console.log('Filters clicked');
  }

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
