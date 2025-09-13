import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
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
  }
}
