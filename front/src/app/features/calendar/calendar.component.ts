import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionData, SessionUtils } from '../../shared/models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../shared/models/clinic-config.model';
import { SessionPopupComponent } from '../../shared/components/session-popup/session-popup.component';
import { NewSessionDialogComponent } from '../../shared/components/new-session-dialog/new-session-dialog.component';
import { CalendarService } from './services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, SessionPopupComponent, NewSessionDialogComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
  private calendarService = inject(CalendarService);

  readonly currentDate = this.calendarService.currentDate;
  readonly currentView = this.calendarService.currentView;
  readonly selectedSessionData = this.calendarService.selectedSessionData;
  readonly sessionData = this.calendarService.sessionData;
  readonly weekDates = this.calendarService.weekDates;
  readonly monthDates = this.calendarService.monthDates;
  readonly sessionDataForCurrentPeriod = this.calendarService.sessionDataForCurrentPeriod;

  readonly showSessionPopup = signal(false);
  readonly showNewSessionDialog = signal(false);
  readonly clinicConfigs = CLINIC_CONFIGS;

  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
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

  onSessionClick(sessionData: SessionData): void {
    this.calendarService.setSelectedSessionData(sessionData);
    this.showSessionPopup.set(true);
  }

  onNewSessionClick(): void {
    this.showNewSessionDialog.set(true);
  }

  onCloseSessionPopup(): void {
    this.showSessionPopup.set(false);
    this.calendarService.setSelectedSessionData(null);
  }

  onCloseNewSessionDialog(): void {
    this.showNewSessionDialog.set(false);
  }

  onSessionDataCreated(sessionData: Omit<SessionData['SessionDetailData'], 'session_id' | 'created_at' | 'updated_at'>): void {
    this.calendarService.addSessionData(sessionData);
    this.showNewSessionDialog.set(false);
  }

  getClinicConfig(clinicId: number): ClinicConfig {
    return this.clinicConfigs.find(config => config.id === clinicId) || this.clinicConfigs[0];
  }

  getClinicConfigFromSessionData(sessionData: SessionData): ClinicConfig {
    return this.getClinicConfig(sessionData.SessionDetailData.ClinicDetailData.clinic_id);
  }

  getSessionDataForDate(date: Date): SessionData[] {
    return this.calendarService.getSessionDataForDate(date);
  }

  getSessionDataForDateAndHour(date: Date, hour: string): SessionData[] {
    const sessions = this.getSessionDataForDate(date);
    return sessions.filter(data => {
      const sessionHour = data.SessionDetailData.start_time.substring(0, 5);
      return sessionHour === hour;
    });
  }

  getPatientNameFromSessionData(sessionData: SessionData): string {
    return sessionData.SessionDetailData.PatientData.name;
  }

  getClinicNameFromSessionData(sessionData: SessionData): string {
    return sessionData.SessionDetailData.ClinicDetailData.clinic_name;
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
      return `${start.getDate()}-${end.getDate()} ${this.monthNames[start.getMonth()]} ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${this.monthNames[start.getMonth()]} - ${end.getDate()} ${this.monthNames[end.getMonth()]} ${start.getFullYear()}`;
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
}