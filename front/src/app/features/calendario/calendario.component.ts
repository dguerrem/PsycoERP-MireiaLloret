import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioService } from './services/calendario.service';
import { Session } from '../../shared/models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../shared/models/clinic-config.model';
import { SessionPopupComponent } from '../../shared/components/session-popup/session-popup.component';
import { NewSessionDialogComponent } from '../../shared/components/new-session-dialog/new-session-dialog.component';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, SessionPopupComponent, NewSessionDialogComponent],
  templateUrl: './calendario.component.html'
})
export class CalendarioComponent {
  private calendarioService = inject(CalendarioService);
  
  readonly currentDate = this.calendarioService.currentDate;
  readonly currentView = this.calendarioService.currentView;
  readonly selectedSession = this.calendarioService.selectedSession;
  readonly sessions = this.calendarioService.sessions;
  readonly weekDates = this.calendarioService.weekDates;
  readonly monthDates = this.calendarioService.monthDates;
  readonly sessionsForCurrentPeriod = this.calendarioService.sessionsForCurrentPeriod;

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
    this.calendarioService.setCurrentView(view);
  }

  navigatePrevious(): void {
    this.calendarioService.navigatePrevious();
  }

  navigateNext(): void {
    this.calendarioService.navigateNext();
  }

  navigateToToday(): void {
    this.calendarioService.navigateToToday();
  }

  onSessionClick(session: Session): void {
    this.calendarioService.setSelectedSession(session);
    this.showSessionPopup.set(true);
  }

  onNewSessionClick(): void {
    this.showNewSessionDialog.set(true);
  }

  onCloseSessionPopup(): void {
    this.showSessionPopup.set(false);
    this.calendarioService.setSelectedSession(null);
  }

  onCloseNewSessionDialog(): void {
    this.showNewSessionDialog.set(false);
  }

  onSessionCreated(session: Omit<Session, 'id' | 'created_at' | 'updated_at'>): void {
    this.calendarioService.addSession(session);
    this.showNewSessionDialog.set(false);
  }

  getClinicConfig(clinicId: number): ClinicConfig {
    return this.clinicConfigs.find(config => config.id === clinicId) || this.clinicConfigs[0];
  }

  getSessionsForDate(date: Date): Session[] {
    return this.calendarioService.getSessionsForDate(date);
  }

  getSessionsForDateAndHour(date: Date, hour: string): Session[] {
    const sessions = this.getSessionsForDate(date);
    return sessions.filter(session => {
      const sessionHour = session.start_time.substring(0, 5);
      return sessionHour === hour;
    });
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

  getPatientName(patientId: number): string {
    const patientNames: { [key: number]: string } = {
      101: 'Ana García',
      102: 'Carlos López',
      103: 'María Rodríguez',
      104: 'Juan Martínez',
      105: 'Laura Sánchez',
      106: 'Pedro González'
    };
    return patientNames[patientId] || `Paciente ${patientId}`;
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getSessionStatusBadgeClass(status: Session['status']): string {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || statusClasses.scheduled;
  }

  getSessionStatusText(status: Session['status']): string {
    const statusTexts = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No asistió'
    };
    return statusTexts[status] || status;
  }
}