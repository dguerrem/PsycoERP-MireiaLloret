import { Injectable, signal, computed, inject } from '@angular/core';
import { SessionData, SessionResponse } from '../../../shared/models/session.model';
import { SessionsService } from './sessions.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private sessionsService = inject(SessionsService);

  private _currentDate = signal(new Date());
  private _currentView = signal<'week' | 'month'>('week');
  private _selectedSessionData = signal<SessionData | null>(null);
  private _sessionData = signal<SessionData[]>([]);

  constructor() {
    this.loadSessions();
  }

  /**
   * Loads sessions from the API with date filtering based on current view
   */
  private loadSessions(): void {
    const currentDate = this._currentDate();
    const currentView = this._currentView();

    let fechaDesde: string;
    let fechaHasta: string;

    if (currentView === 'week') {
      // For week view, calculate the week start and end dates
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      fechaDesde = startOfWeek.toISOString().split('T')[0];
      fechaHasta = endOfWeek.toISOString().split('T')[0];
    } else {
      // For month view, use first and last day of the month
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      fechaDesde = firstDayOfMonth.toISOString().split('T')[0];
      fechaHasta = lastDayOfMonth.toISOString().split('T')[0];
    }

    this.sessionsService.getSessionsWithDateFilter(fechaDesde, fechaHasta, 1, 1000).subscribe({
      next: (response: SessionResponse) => {
        // Transform API data to match expected structure
        const transformedData = response.data.map(session => ({
          SessionDetailData: {
            ...session.SessionDetailData,
            // Add missing properties with default values
            type: session.SessionDetailData.type || 'Sesión', // Default type
            completed: session.SessionDetailData.completed || false,
            cancelled: session.SessionDetailData.cancelled || false,
            no_show: session.SessionDetailData.no_show || false,
            sended: session.SessionDetailData.sended || false,
            created_at: session.SessionDetailData.created_at || new Date().toISOString(),
            updated_at: session.SessionDetailData.updated_at || new Date().toISOString()
          }
        }));

        this._sessionData.set(transformedData);
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
      }
    });
  }

  /**
   * Reloads sessions from the API
   */
  reloadSessions(): void {
    this.loadSessions();
  }

  // Computed signals
  readonly currentDate = this._currentDate.asReadonly();
  readonly currentView = this._currentView.asReadonly();
  readonly selectedSessionData = this._selectedSessionData.asReadonly();
  readonly sessionData = this._sessionData.asReadonly();

  readonly weekDates = computed(() => {
    const current = this._currentDate();
    const startOfWeek = new Date(current);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  });

  readonly monthDates = computed(() => {
    const current = this._currentDate();
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const startDate = new Date(firstDay);
    const startDay = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (startDay === 0 ? 6 : startDay - 1));

    const dates = [];
    const current_date = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current_date));
      current_date.setDate(current_date.getDate() + 1);
    }

    return dates;
  });

  readonly sessionDataForCurrentPeriod = computed(() => {
    const sessionData = this._sessionData();
    const view = this._currentView();

    if (view === 'week') {
      const weekDates = this.weekDates();
      const startDate = weekDates[0];
      const endDate = weekDates[6];

      const filtered = sessionData.filter(data => {
        const sessionDateStr = data.SessionDetailData.session_date;
        const sessionDate = new Date(sessionDateStr);

        // Normalize dates to midnight for comparison
        const normalizedSessionDate = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
        const normalizedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const normalizedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        return normalizedSessionDate >= normalizedStartDate && normalizedSessionDate <= normalizedEndDate;
      });

      return filtered;
    } else {
      const monthDates = this.monthDates();
      const startDate = monthDates[0];
      const endDate = monthDates[41];

      const filtered = sessionData.filter(data => {
        const sessionDate = new Date(data.SessionDetailData.session_date);
        return sessionDate >= startDate && sessionDate <= endDate;
      });

      return filtered;
    }
  });

  setCurrentDate(date: Date): void {
    this._currentDate.set(new Date(date));
  }

  setCurrentView(view: 'week' | 'month'): void {
    this._currentView.set(view);
    this.loadSessions(); // Reload sessions when view changes
  }

  setSelectedSessionData(sessionData: SessionData | null): void {
    this._selectedSessionData.set(sessionData);
  }

  navigateToToday(): void {
    this._currentDate.set(new Date());
    this.loadSessions(); // Reload sessions when navigating to today
  }

  navigatePrevious(): void {
    const current = this._currentDate();
    const view = this._currentView();

    if (view === 'week') {
      const newDate = new Date(current);
      newDate.setDate(current.getDate() - 7);
      this._currentDate.set(newDate);
    } else {
      const newDate = new Date(current);
      newDate.setMonth(current.getMonth() - 1);
      this._currentDate.set(newDate);
    }
    this.loadSessions(); // Reload sessions after navigation
  }

  navigateNext(): void {
    const current = this._currentDate();
    const view = this._currentView();

    if (view === 'week') {
      const newDate = new Date(current);
      newDate.setDate(current.getDate() + 7);
      this._currentDate.set(newDate);
    } else {
      const newDate = new Date(current);
      newDate.setMonth(current.getMonth() + 1);
      this._currentDate.set(newDate);
    }
    this.loadSessions(); // Reload sessions after navigation
  }

  getSessionDataForDate(date: Date): SessionData[] {
    const dateString = date.toISOString().split('T')[0];
    return this._sessionData().filter(data => {
      const apiDateString = data.SessionDetailData.session_date.split('T')[0];
      return apiDateString === dateString;
    });
  }

  getSessionDataById(sessionId: number): SessionData | null {
    return this._sessionData().find(data =>
      data.SessionDetailData.session_id === sessionId
    ) || null;
  }

  addSessionData(sessionData: Omit<SessionData['SessionDetailData'], 'session_id' | 'created_at' | 'updated_at'>): void {
    const newSessionData: SessionData = {
      SessionDetailData: {
        ...sessionData,
        session_id: Math.max(...this._sessionData().map(s => s.SessionDetailData.session_id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    this._sessionData.update(data => [...data, newSessionData]);
  }

  updateSessionData(sessionId: number, updates: Partial<SessionData['SessionDetailData']>): void {
    this._sessionData.update(data =>
      data.map(sessionData =>
        sessionData.SessionDetailData.session_id === sessionId
          ? {
              SessionDetailData: {
                ...sessionData.SessionDetailData,
                ...updates,
                updated_at: new Date().toISOString()
              }
            }
          : sessionData
      )
    );
  }

  deleteSessionData(sessionId: number): void {
    this._sessionData.update(data =>
      data.filter(sessionData => sessionData.SessionDetailData.session_id !== sessionId)
    );
  }

  sendReminder(sessionId: number): void {
    this.updateSessionData(sessionId, { sended: true });
  }

  openWhatsAppReminder(sessionData: SessionData): void {
    const phoneNumber = '642963419';
    const patientName = sessionData.SessionDetailData.PatientData.name;
    const sessionDate = new Date(sessionData.SessionDetailData.session_date).toLocaleDateString('es-ES');
    const sessionTime = sessionData.SessionDetailData.start_time.substring(0, 5);

    const message = `Hola ${patientName}, te recordamos que tienes una cita programada para el ${sessionDate} a las ${sessionTime}. ¡Te esperamos!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }
}
