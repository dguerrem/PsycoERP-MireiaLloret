import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SessionsService } from '../calendar/services/sessions.service';
import { SessionData, SessionUtils } from '../../shared/models/session.model';
import { ClinicSelectorComponent } from '../../shared/components/clinic-selector/clinic-selector.component';
import { HttpClient } from '@angular/common/http';
import { Clinic } from '../clinics/models/clinic.model';
import { environment } from '../../../environments/environment';

interface SessionFilters {
  clinicId: number | null;
  sessionType: string | null;
  status: string | null;
  paymentMethod: string | null;
  dateFrom: string;
  dateTo: string;
}

interface SessionStats {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  totalRevenue: number;
}

/**
 * Session management feature component
 *
 * This component provides session management functionality including:
 * - Session listing and filtering
 * - Session creation and editing
 * - Session status management
 * - Integration with calendar system
 *
 * @example
 * ```html
 * <app-session></app-session>
 * ```
 */
@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClinicSelectorComponent],
  templateUrl: './session.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionComponent implements OnInit {
  private sessionsService = inject(SessionsService);
  private http = inject(HttpClient);

  // Expose Math for template
  Math = Math;

  // State signals
  sessions = signal<SessionData[]>([]);
  clinics = signal<Clinic[]>([]);
  isLoading = signal(false);
  totalSessions = signal(0);

  // Filter controls
  clinicControl = new FormControl<number | null>(null);

  // Filter signals
  filters = signal<SessionFilters>({
    clinicId: null,
    sessionType: null,
    status: null,
    paymentMethod: null,
    dateFrom: '',
    dateTo: ''
  });

  // Pagination signals
  currentPage = signal(1);
  pageSize = signal(25);
  pageSizeOptions = [10, 25, 50, 100];

  // Computed values - Now sessions come directly from API with pagination
  stats = computed(() => {
    const sessions = this.sessions();

    const stats: SessionStats = {
      total: this.totalSessions(),
      completed: 0,
      scheduled: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    // Calculate stats from current page only (for display)
    sessions.forEach(session => {
      const status = this.getSessionStatus(session);
      if (status === 'completada') stats.scheduled++;
      if (status === 'cancelada') stats.cancelled++;
    });

    return stats;
  });

  totalPages = computed(() => {
    return Math.ceil(this.totalSessions() / this.pageSize());
  });

  ngOnInit(): void {
    this.loadClinics();
    this.loadSessions();
    this.setupClinicControlSubscription();
  }

  private loadClinics(): void {
    this.http.get<{ data: Clinic[] }>(`${environment.api.baseUrl}/clinics`).subscribe({
      next: (response) => {
        this.clinics.set(response.data);
      },
      error: (error) => {
        console.error('Error loading clinics:', error);
      }
    });
  }

  private setupClinicControlSubscription(): void {
    this.clinicControl.valueChanges.subscribe(value => {
      this.onFilterChange('clinicId', value);
    });
  }

  private loadSessions(): void {
    this.isLoading.set(true);

    const currentFilters = this.filters();
    const page = this.currentPage();
    const limit = this.pageSize();

    // Build query params
    const params: any = {
      page: page.toString(),
      limit: limit.toString()
    };

    if (currentFilters.clinicId) {
      params.clinic_id = currentFilters.clinicId.toString();
    }

    if (currentFilters.status) {
      params.status = currentFilters.status;
    }

    if (currentFilters.paymentMethod) {
      params.payment_method = currentFilters.paymentMethod;
    }

    if (currentFilters.dateFrom) {
      params.fecha_desde = currentFilters.dateFrom;
    }

    if (currentFilters.dateTo) {
      params.fecha_hasta = currentFilters.dateTo;
    }

    // Build query string
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    this.http.get<any>(`${environment.api.baseUrl}/sessions?${queryString}`).subscribe({
      next: (response) => {
        this.sessions.set(response.data);
        // The API returns totalRecords instead of total
        this.totalSessions.set(response.pagination.totalRecords || response.pagination.total || 0);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange(filterName: keyof SessionFilters, value: any): void {
    this.filters.update(f => ({ ...f, [filterName]: value }));
    this.currentPage.set(1);
    this.loadSessions();
  }

  clearFilters(): void {
    this.filters.set({
      clinicId: null,
      sessionType: null,
      status: null,
      paymentMethod: null,
      dateFrom: '',
      dateTo: ''
    });
    this.clinicControl.setValue(null);
    this.currentPage.set(1);
    this.loadSessions();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(Number(target.value));
    this.currentPage.set(1);
    this.loadSessions();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadSessions();
  }

  getSessionStatus(session: SessionData): 'completada' | 'cancelada' {
    return session.SessionDetailData.status;
  }

  getStatusClass(status: string): string {
    const classes = {
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const texts = {
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return texts[status as keyof typeof texts] || status;
  }

  formatPaymentMethod(method: string): string {
    return SessionUtils.formatPaymentMethod(method);
  }

  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // If no total pages, return empty array
    if (total === 0) {
      return [];
    }

    // Show max 5 pages
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    // Adjust start if we're near the end
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
