import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../../shared/models/patient.model';
import { PatientDetailResponse, PatientDetailUtils, Session, Invoice, Bonus } from '../../../shared/models/patient-detail.model';
import { PatientSummaryComponent } from '../components/patient-summary.component';
import { PatientDataComponent } from '../components/patient-data.component';
import { PatientClinicalHistoryComponent } from '../components/patient-clinical-history.component';

/**
 * Patient Detail Component
 *
 * Displays detailed information about a patient
 * Supports both viewing existing patients and creating new ones
 */
@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, PatientSummaryComponent, PatientDataComponent, PatientClinicalHistoryComponent],
  templateUrl: './patient-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  readonly patient = signal<Patient | null>(null);
  readonly patientDetailData = signal<PatientDetailResponse | null>(null);
  readonly isNewPatient = signal(false);
  readonly isLoading = signal(true);
  readonly activeTab = signal("summary");

  // Real data computed from API
  readonly sessions = computed(() => {
    const data = this.patientDetailData();
    if (!data || !data.success) return [];

    return data.data.PatientResume.PatientResumeSessions.map(resumeSession =>
      PatientDetailUtils.transformResumeSessionToSession(resumeSession)
    );
  });

  readonly sessionStats = computed(() => {
    const data = this.patientDetailData();
    if (!data || !data.success) return {
      completed: 0,
      scheduled: 0,
      cancelled: 0
    };

    const stats = data.data.PatientResume.PatientSessionsStatus;
    return {
      completed: parseInt(stats.completed_sessions) || 0,
      scheduled: parseInt(stats.scheduled_sessions) || 0,
      cancelled: parseInt(stats.cancelled_sessions) || 0
    };
  });

  readonly billingInfo = computed(() => {
    const data = this.patientDetailData();
    if (!data || !data.success) return {
      totalSpent: 0,
      invoicesIssued: 0
    };

    const billing = data.data.PatientResume.PatientResumeInvoice;
    return {
      totalSpent: parseFloat(billing.total_spent_current_year) || 0,
      invoicesIssued: billing.invoices_issued || 0
    };
  });

  readonly sessionType = computed(() => {
    const data = this.patientDetailData();
    if (!data || !data.success) return 'Presencial';

    const resume = data.data.PatientResume as any;
    const preferredMode = resume.preferred_mode || 'presencial';
    return preferredMode.charAt(0).toUpperCase() + preferredMode.slice(1).toLowerCase();
  });

  readonly invoices = computed(() => {
    // Empty for now as PatientInvoice is empty in API
    return [] as Invoice[];
  });

  readonly bonuses = computed(() => {
    // Empty for now - no bonus data in API
    return [] as Bonus[];
  });

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');

    if (patientId) {
      this.loadPatientDetail(Number(patientId));
    } else {
      this.isLoading.set(false);
    }
  }

  private loadPatientDetail(patientId: number): void {
    this.isLoading.set(true);

    this.http.get<PatientDetailResponse>(`http://localhost:3000/api/patients/${patientId}`)
      .subscribe({
        next: (response) => {
          this.patientDetailData.set(response);

          if (response.success && response.data) {
            // Transform API data to Patient interface
            const transformedPatient = PatientDetailUtils.transformPatientData(response.data.PatientData);
            transformedPatient.id = response.data.PatientResume.id;

            this.patient.set(transformedPatient);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading patient detail:', error);
          this.isLoading.set(false);
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/patient']);
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'en curso':
        return 'bg-green-100 text-green-800';
      case 'fin del tratamiento':
        return 'bg-blue-100 text-blue-800';
      case 'en pausa':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandono':
      case 'derivación':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en curso':
        return 'Activo';
      case 'fin del tratamiento':
        return 'Alta';
      case 'en pausa':
        return 'En Pausa';
      case 'abandono':
        return 'Abandono';
      case 'derivación':
        return 'Derivación';
      default:
        return status;
    }
  }

  private getFullName(patient: Patient): string {
    return `${patient.first_name} ${patient.last_name}`;
  }
}