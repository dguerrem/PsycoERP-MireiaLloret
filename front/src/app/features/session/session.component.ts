import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
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
  completada: number;
  cancelada: number;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent implements OnInit {
  private sessionsService = inject(SessionsService);
  private http = inject(HttpClient);

  // Expose Math for template
  Math = Math;

  // State signals
  allSessions = signal<SessionData[]>([]); // All sessions from API
  sessions = signal<SessionData[]>([]); // Current page sessions
  clinics = signal<Clinic[]>([]);
  isLoading = signal(false);
  totalSessions = signal(0);

  // Filter controls
  clinicControl = new FormControl<number | null>(null);

  // Date validation signals
  dateFromError = signal<string | null>(null);
  dateToError = signal<string | null>(null);

  // Filter signals with initial dates
  filters = signal<SessionFilters>({
    clinicId: null,
    sessionType: null,
    status: null,
    paymentMethod: null,
    dateFrom: this.getThreeMonthsAgo(),
    dateTo: this.getTodayDate(),
  });

  // Pagination signals (frontend only)
  currentPage = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [10, 25, 50, 100];

  // Computed values - Calculate stats from all sessions
  stats = computed(() => {
    const allSessions = this.allSessions();
    const stats: SessionStats = {
      total: this.totalSessions(),
      completada: 0,
      cancelada: 0,
      totalRevenue: 0,
    };

    // Calculate stats from all sessions (not just current page)
    allSessions.forEach((session) => {
      const status = this.getSessionStatus(session);
      if (status === 'completada') stats.completada++;
      if (status === 'cancelada') stats.cancelada++;
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
    this.http
      .get<{ data: Clinic[] }>(`${environment.api.baseUrl}/clinics`)
      .subscribe({
        next: (response) => {
          this.clinics.set(response.data);
        },
        error: (error) => {
          console.error('Error loading clinics:', error);
        },
      });
  }

  private setupClinicControlSubscription(): void {
    this.clinicControl.valueChanges.subscribe((value) => {
      this.onFilterChange('clinicId', value);
    });
  }

  private loadSessions(): void {
    this.isLoading.set(true);

    const currentFilters = this.filters();

    // Build query params - always request 5000 sessions
    const params: any = {
      page: '1',
      limit: '5000',
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
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    this.http
      .get<any>(`${environment.api.baseUrl}/sessions?${queryString}`)
      .subscribe({
        next: (response) => {
          // Store all sessions
          this.allSessions.set(response.data);
          this.totalSessions.set(response.data.length);

          // Apply frontend pagination
          this.updatePaginatedSessions();

          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading sessions:', error);
          this.isLoading.set(false);
        },
      });
  }

  private updatePaginatedSessions(): void {
    const allSessions = this.allSessions();
    const page = this.currentPage();
    const size = this.pageSize();

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    this.sessions.set(allSessions.slice(startIndex, endIndex));
  }

  onFilterChange(filterName: keyof SessionFilters, value: any): void {
    // Handle empty date values - reset to defaults
    if (filterName === 'dateFrom' && (!value || value === '')) {
      this.filters.update((f) => ({ ...f, dateFrom: this.getThreeMonthsAgo() }));
      this.dateFromError.set(null);
      this.currentPage.set(1);
      this.loadSessions();
      return;
    }

    if (filterName === 'dateTo' && (!value || value === '')) {
      this.filters.update((f) => ({ ...f, dateTo: this.getTodayDate() }));
      this.dateToError.set(null);
      this.currentPage.set(1);
      this.loadSessions();
      return;
    }

    this.filters.update((f) => ({ ...f, [filterName]: value }));

    // Validate dates when they change
    if (filterName === 'dateFrom' || filterName === 'dateTo') {
      this.validateDates();
      // Only load sessions if dates are valid
      if (!this.dateFromError() && !this.dateToError()) {
        this.currentPage.set(1);
        this.loadSessions();
      }
    } else {
      this.currentPage.set(1);
      this.loadSessions();
    }
  }

  clearFilters(): void {
    this.filters.set({
      clinicId: null,
      sessionType: null,
      status: null,
      paymentMethod: null,
      dateFrom: this.getThreeMonthsAgo(),
      dateTo: this.getTodayDate(),
    });
    this.clinicControl.setValue(null);
    this.dateFromError.set(null);
    this.dateToError.set(null);
    this.currentPage.set(1);
    this.loadSessions();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(Number(target.value));
    this.currentPage.set(1);
    this.updatePaginatedSessions();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.updatePaginatedSessions();
  }

  getSessionStatus(session: SessionData): 'completada' | 'cancelada' {
    return session.SessionDetailData.status;
  }

  getStatusClass(status: string): string {
    const classes = {
      completada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return (
      classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }

  getStatusText(status: string): string {
    const texts = {
      completada: 'Completada',
      cancelada: 'Cancelada',
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

  // Date helper methods
  private getTodayDate(): string {
    const today = new Date();
    return this.formatDateToISO(today);
  }

  private getThreeMonthsAgo(): string {
    const today = new Date();
    today.setMonth(today.getMonth() - 3);
    return this.formatDateToISO(today);
  }

  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private validateDates(): void {
    const currentFilters = this.filters();
    let dateFrom = currentFilters.dateFrom;
    let dateTo = currentFilters.dateTo;

    // Reset errors
    this.dateFromError.set(null);
    this.dateToError.set(null);

    // If dates are empty, set to defaults (shouldn't happen with new logic, but defensive)
    if (!dateFrom || dateFrom === '') {
      dateFrom = this.getThreeMonthsAgo();
      this.filters.update((f) => ({ ...f, dateFrom }));
    }

    if (!dateTo || dateTo === '') {
      dateTo = this.getTodayDate();
      this.filters.update((f) => ({ ...f, dateTo }));
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    // Validate: dateFrom cannot be greater than dateTo
    if (fromDate > toDate) {
      this.dateFromError.set('La fecha desde no puede ser mayor a la fecha hasta');
      this.dateToError.set('La fecha hasta no puede ser menor a la fecha desde');
      return;
    }

    // Validate: range cannot exceed 3 years (1095 days)
    const diffInMs = toDate.getTime() - fromDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const threeYearsInDays = 365 * 3;

    if (diffInDays > threeYearsInDays) {
      this.dateFromError.set('El rango no puede superar 3 años');
      this.dateToError.set('El rango no puede superar 3 años');
    }
  }
}
