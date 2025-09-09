import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../../shared/models/patient.model';
import { PatientsService } from '../services/patients.service';

/**
 * Patient Detail Component
 * 
 * Displays detailed information about a patient
 * Supports both viewing existing patients and creating new ones
 */
@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientsService = inject(PatientsService);

  readonly patient = signal<Patient | null>(null);
  readonly isNewPatient = signal(false);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    
    if (patientId === 'nuevo') {
      this.isNewPatient.set(true);
      this.isLoading.set(false);
    } else if (patientId) {
      const id = parseInt(patientId, 10);
      const foundPatient = this.patientsService.getPatientById(id);
      
      if (foundPatient) {
        this.patient.set(foundPatient);
        this.patientsService.selectPatient(foundPatient);
      } else {
        // Patient not found, redirect back to list
        this.router.navigate(['/patient']);
      }
      
      this.isLoading.set(false);
    } else {
      // No ID provided, redirect back to list
      this.router.navigate(['/patient']);
    }
  }

  /**
   * Navigate back to patient list
   */
  onBack(): void {
    this.router.navigate(['/patient']);
  }

  /**
   * Handle patient save (create or update)
   */
  onSave(patient: Patient): void {
    if (this.isNewPatient()) {
      const { id, created_at, updated_at, ...patientData } = patient;
      this.patientsService.addPatient(patientData);
    } else {
      const { id, created_at, updated_at, ...patientData } = patient;
      this.patientsService.updatePatient(patient.id, patientData);
    }
    
    this.router.navigate(['/patient']);
  }

  /**
   * Handle patient deletion
   */
  onDelete(patientId: number): void {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      this.patientsService.deletePatient(patientId);
      this.router.navigate(['/patient']);
    }
  }
}
