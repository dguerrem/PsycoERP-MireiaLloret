import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SessionData,
  SessionUtils,
} from '../../shared/models/session.model';
import {
  CLINIC_CONFIGS,
  ClinicConfig,
} from '../../shared/models/clinic-config.model';
import { CalendarService } from './services/calendar.service';
import { NewSessionFormComponent } from './components/new-sesion-dialog/new-session-form.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NewSessionFormComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private calendarService = inject(CalendarService);

  readonly currentDate = this.calendarService.currentDate;
  readonly currentView = this.calendarService.currentView;
  readonly selectedSessionData = this.calendarService.selectedSessionData;
  readonly sessionData = this.calendarService.sessionData;
  readonly weekDates = this.calendarService.weekDates;
  readonly monthDates = this.calendarService.monthDates;
  readonly sessionDataForCurrentPeriod =
    this.calendarService.sessionDataForCurrentPeriod;

  readonly showSessionPopup = signal(false);
  readonly showNewSessionDialog = signal(false);
  readonly showReminderConfirmModal = signal(false);
  readonly pendingReminderSession = signal<SessionData | null>(null);
  readonly clinicConfigs = CLINIC_CONFIGS;

  // Data to prefill when creating new session from calendar
  prefilledSessionData: {
    date: string;
    startTime: string | null;
    sessionData?: SessionData;
  } | null = null;

  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  readonly hours = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  setView(view: 'week' | 'month'): void {
    this.calendarService.setCurrentView(view);
  }

  navigatePrevious(): void {
    this.calendarService.navigatePrevious();
  }

  navigateNext(): void {
    this.calendarService.navigateNext();
  }

  navigateToToday(): void {
    this.calendarService.navigateToToday();
  }

  onDateSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const [year, month] = input.value.split('-').map(Number);
    const newDate = new Date(year, month - 1, 1);
    this.calendarService.setCurrentDate(newDate);
    this.calendarService.reloadSessions();
  }

  onWeekDateSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = new Date(input.value + 'T00:00:00');
    this.calendarService.setCurrentDate(selectedDate);
    this.calendarService.reloadSessions();
  }

  getCurrentMonthValue(): string {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  getCurrentDateValue(): string {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openDatePicker(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && typeof input.showPicker === 'function') {
      input.showPicker();
    }
  }

  onSessionClick(sessionData: SessionData): void {
    // Open the session form in edit mode instead of showing popup
    this.prefilledSessionData = {
      date: sessionData.SessionDetailData.session_date,
      startTime: sessionData.SessionDetailData.start_time.substring(0, 5),
      sessionData: sessionData, // Add the full session data for editing
    };
    this.showNewSessionDialog.set(true);
  }

  onNewSessionClick(): void {
    this.showNewSessionDialog.set(true);
  }

  onNewSessionClickForDateTime(date: Date, hour: string): void {
    // Pre-fill the form with the selected date and hour
    this.prefilledSessionData = {
      date: this.formatDateForInput(date),
      startTime: hour,
    };
    this.showNewSessionDialog.set(true);
  }

  onNewSessionClickForDate(date: Date): void {
    // Pre-fill the form with the selected date
    this.prefilledSessionData = {
      date: this.formatDateForInput(date),
      startTime: null,
    };
    this.showNewSessionDialog.set(true);
  }

  private formatDateForInput(date: Date): string {
    // Format date in local timezone to avoid timezone offset issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCloseSessionPopup(): void {
    this.showSessionPopup.set(false);
    this.calendarService.setSelectedSessionData(null);
  }

  onCloseNewSessionDialog(): void {
    this.showNewSessionDialog.set(false);
    this.prefilledSessionData = null;
  }

  onSessionDataCreated(sessionData: SessionData): void {
    this.showNewSessionDialog.set(false);
    this.prefilledSessionData = null;

    // Wait a moment for the API to process, then reload sessions
    setTimeout(() => {
      this.calendarService.reloadSessions();
    }, 100);
  }

  getClinicConfig(clinicId: number): ClinicConfig {
    return (
      this.clinicConfigs.find((config) => config.id === clinicId) ||
      this.clinicConfigs[0]
    );
  }

  getSessionDataForDate(date: Date): SessionData[] {
    return this.calendarService.getSessionDataForDate(date);
  }

  getSessionDataForDateAndHour(date: Date, hour: string): SessionData[] {
    const sessions = this.getSessionDataForDate(date);
    return sessions.filter((data) => {
      const sessionHour = data.SessionDetailData.start_time.substring(0, 5);
      return sessionHour === hour;
    });
  }

  getPatientNameFromSessionData(sessionData: SessionData): string {
    return sessionData.SessionDetailData.PatientData.name;
  }

  getClinicNameFromSessionData(sessionData: SessionData): string {
    return sessionData.SessionDetailData.ClinicDetailData.clinic_name || 'Sin clínica';
  }

  formatDate(date: Date): string {
    return date.getDate().toString();
  }

  formatMonthYear(date: Date): string {
    return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatWeekRange(dates: Date[]): string {
    if (dates.length === 0) return '';

    const start = dates[0];
    const end = dates[6];

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${
        this.monthNames[start.getMonth()]
      } ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${
        this.monthNames[start.getMonth()]
      } - ${end.getDate()} ${
        this.monthNames[end.getMonth()]
      } ${start.getFullYear()}`;
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    const current = this.currentDate();
    return date.getMonth() === current.getMonth();
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getSessionStatusBadgeClass(sessionData: SessionData): string {
    return SessionUtils.getStatusBadgeClass(sessionData);
  }

  getSessionStatusText(sessionData: SessionData): string {
    return SessionUtils.getStatusText(sessionData);
  }

  formatPrice(price: number): string {
    return SessionUtils.formatPrice(price);
  }

  formatPaymentMethod(method: string): string {
    return SessionUtils.formatPaymentMethod(method);
  }

  onSendReminder(sessionData: SessionData, event: Event): void {
    event.stopPropagation(); // Prevenir que se abra el popup de sesión
    this.pendingReminderSession.set(sessionData);
    this.showReminderConfirmModal.set(true);
  }

  getFormattedSessionDate(sessionData: SessionData): string {
    return new Date(
      sessionData.SessionDetailData.session_date
    ).toLocaleDateString('es-ES');
  }

  getFormattedSessionTime(sessionData: SessionData): string {
    return sessionData.SessionDetailData.start_time.substring(0, 5);
  }

  getClinicConfigFromSessionData(sessionData: SessionData): ClinicConfig & { hasCustomColor: boolean } {
    const clinicData = sessionData.SessionDetailData.ClinicDetailData;
    const clinicId = clinicData.clinic_id;
    const apiColor = clinicData.clinic_color;

    // If we have a color from the API, use it
    if (apiColor) {
      return {
        id: clinicId || 0,
        name: clinicData.clinic_name || 'Sin clínica',
        color: 'text-white',
        backgroundColor: '', // We'll use inline styles for custom colors
        borderColor: '',
        hasCustomColor: true
      };
    }

    // Fallback to hardcoded configs if no color from API
    const config = this.clinicConfigs.find((config) => config.id === clinicId) || this.clinicConfigs[0];
    return {
      ...config,
      hasCustomColor: false
    };
  }

  getClinicColorFromSessionData(sessionData: SessionData): string | null {
    return sessionData.SessionDetailData.ClinicDetailData.clinic_color;
  }

  getVisibleClinics(): Array<{ id: number | null; name: string; color: string; hasCustomColor: boolean }> {
    const sessions = this.sessionDataForCurrentPeriod();
    const clinicsMap = new Map<number | null, { id: number | null; name: string; color: string; hasCustomColor: boolean }>();

    sessions.forEach(session => {
      const clinicData = session.SessionDetailData.ClinicDetailData;
      const clinicId = clinicData.clinic_id;
      const clinicName = clinicData.clinic_name || 'Sin clínica';
      const clinicColor = clinicData.clinic_color;

      if (!clinicsMap.has(clinicId)) {
        if (clinicColor) {
          // Clinic with custom color from API
          clinicsMap.set(clinicId, {
            id: clinicId,
            name: clinicName,
            color: clinicColor,
            hasCustomColor: true
          });
        } else {
          // Fallback to hardcoded config
          const config = this.clinicConfigs.find(c => c.id === clinicId) || this.clinicConfigs[0];
          const colorMatch = config.backgroundColor.match(/bg-\[([^\]]+)\]|bg-(\w+-\d+)/);
          let hexColor = '#0891b2'; // default color

          if (colorMatch) {
            const colorValue = colorMatch[1] || colorMatch[2];
            // Simple mapping for common Tailwind colors to hex
            const colorMap: Record<string, string> = {
              'green-500': '#10b981',
              'purple-500': '#8b5cf6',
              'orange-500': '#f97316',
              'pink-500': '#ec4899',
              'yellow-500': '#eab308',
              'blue-500': '#3b82f6'
            };
            hexColor = colorMap[colorValue] || colorValue.startsWith('#') ? colorValue : hexColor;
          }

          clinicsMap.set(clinicId, {
            id: clinicId,
            name: clinicName,
            color: hexColor,
            hasCustomColor: false
          });
        }
      }
    });

    return Array.from(clinicsMap.values()).sort((a, b) => {
      if (a.id === null) return 1;
      if (b.id === null) return -1;
      return (a.id || 0) - (b.id || 0);
    });
  }

  isSessionCancelled(sessionData: SessionData): boolean {
    return (
      sessionData.SessionDetailData.status === 'cancelada' ||
      sessionData.SessionDetailData.cancelled
    );
  }

  hasActiveSessionInSlot(date: Date, hour: string): boolean {
    const sessions = this.getSessionDataForDateAndHour(date, hour);
    return sessions.some((session) => !this.isSessionCancelled(session));
  }

  hasActiveSessionInDate(date: Date): boolean {
    const sessions = this.getSessionDataForDate(date);
    return sessions.some((session) => !this.isSessionCancelled(session));
  }

  getSortedSessionDataForDateAndHour(date: Date, hour: string): SessionData[] {
    const sessions = this.getSessionDataForDateAndHour(date, hour);
    return sessions.sort((a, b) => {
      const aIsCancelled = this.isSessionCancelled(a);
      const bIsCancelled = this.isSessionCancelled(b);

      // Active sessions (not cancelled) come first
      if (!aIsCancelled && bIsCancelled) return -1;
      if (aIsCancelled && !bIsCancelled) return 1;
      return 0; // Same status, maintain original order
    });
  }

  getSortedSessionDataForDate(date: Date): SessionData[] {
    const sessions = this.getSessionDataForDate(date);
    return sessions.sort((a, b) => {
      const aIsCancelled = this.isSessionCancelled(a);
      const bIsCancelled = this.isSessionCancelled(b);

      // Active sessions (not cancelled) come first
      if (!aIsCancelled && bIsCancelled) return -1;
      if (aIsCancelled && !bIsCancelled) return 1;

      // If same status (both active or both cancelled), sort by start time
      const aStartTime = a.SessionDetailData.start_time;
      const bStartTime = b.SessionDetailData.start_time;
      return aStartTime.localeCompare(bStartTime);
    });
  }
}
