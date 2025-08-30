import { Injectable, signal, computed } from '@angular/core';
import { Session } from '../../../shared/models/session.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _currentDate = signal(new Date());
  private _currentView = signal<'week' | 'month'>('week');
  private _selectedSession = signal<Session | null>(null);
  private _sessions = signal<Session[]>([
    {
      id: 1,
      patient_id: 101,
      clinic_id: 1,
      session_date: "2025-08-30T00:00:00.000Z",
      start_time: "09:00:00",
      end_time: "10:00:00",
      mode: "Presencial",
      type: "Terapia Individual",
      status: "scheduled",
      price: "60.00",
      payment_method: "card",
      payment_status: "paid",
      notes: "Primera sesión del mes",
      created_at: "2025-08-25T10:00:00.000Z",
      updated_at: "2025-08-25T10:00:00.000Z"
    },
    {
      id: 2,
      patient_id: 102,
      clinic_id: 2,
      session_date: "2025-08-30T00:00:00.000Z",
      start_time: "11:00:00",
      end_time: "12:00:00",
      mode: "Online",
      type: "Terapia de Pareja",
      status: "completed",
      price: "80.00",
      payment_method: "transfer",
      payment_status: "paid",
      notes: "Sesión completada con éxito",
      created_at: "2025-08-25T11:00:00.000Z",
      updated_at: "2025-08-30T12:00:00.000Z"
    },
    {
      id: 3,
      patient_id: 103,
      clinic_id: 3,
      session_date: "2025-08-31T00:00:00.000Z",
      start_time: "15:00:00",
      end_time: "16:00:00",
      mode: "Presencial",
      type: "Terapia Individual",
      status: "scheduled",
      price: "65.00",
      payment_method: "cash",
      payment_status: "pending",
      notes: "Paciente nuevo",
      created_at: "2025-08-26T14:00:00.000Z",
      updated_at: "2025-08-26T14:00:00.000Z"
    },
    {
      id: 4,
      patient_id: 104,
      clinic_id: 4,
      session_date: "2025-09-01T00:00:00.000Z",
      start_time: "10:30:00",
      end_time: "11:30:00",
      mode: "Online",
      type: "Terapia Familiar",
      status: "cancelled",
      price: "90.00",
      payment_method: "card",
      payment_status: "pending",
      notes: "Cancelada por el paciente",
      created_at: "2025-08-27T09:00:00.000Z",
      updated_at: "2025-08-28T16:30:00.000Z"
    },
    {
      id: 5,
      patient_id: 105,
      clinic_id: 5,
      session_date: "2025-09-02T00:00:00.000Z",
      start_time: "16:00:00",
      end_time: "17:00:00",
      mode: "Presencial",
      type: "Terapia Individual",
      status: "scheduled",
      price: "70.00",
      payment_method: "bizum",
      payment_status: "paid",
      notes: "Sesión de seguimiento",
      created_at: "2025-08-28T13:00:00.000Z",
      updated_at: "2025-08-28T13:00:00.000Z"
    },
    {
      id: 6,
      patient_id: 106,
      clinic_id: 1,
      session_date: "2025-09-03T00:00:00.000Z",
      start_time: "14:00:00",
      end_time: "15:00:00",
      mode: "Online",
      type: "Terapia Individual",
      status: "completed",
      price: "60.00",
      payment_method: "card",
      payment_status: "paid",
      notes: "Excelente progreso",
      created_at: "2025-08-29T10:00:00.000Z",
      updated_at: "2025-09-03T15:00:00.000Z"
    }
  ]);

  readonly currentDate = this._currentDate.asReadonly();
  readonly currentView = this._currentView.asReadonly();
  readonly selectedSession = this._selectedSession.asReadonly();
  readonly sessions = this._sessions.asReadonly();

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

  readonly sessionsForCurrentPeriod = computed(() => {
    const sessions = this._sessions();
    const view = this._currentView();

    if (view === 'week') {
      const weekDates = this.weekDates();
      const startDate = weekDates[0];
      const endDate = weekDates[6];

      return sessions.filter(session => {
        const sessionDate = new Date(session.session_date);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    } else {
      const monthDates = this.monthDates();
      const startDate = monthDates[0];
      const endDate = monthDates[41];

      return sessions.filter(session => {
        const sessionDate = new Date(session.session_date);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    }
  });

  setCurrentDate(date: Date): void {
    this._currentDate.set(new Date(date));
  }

  setCurrentView(view: 'week' | 'month'): void {
    this._currentView.set(view);
  }

  setSelectedSession(session: Session | null): void {
    this._selectedSession.set(session);
  }

  navigateToToday(): void {
    this._currentDate.set(new Date());
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
  }

  getSessionsForDate(date: Date): Session[] {
    const dateString = date.toISOString().split('T')[0];
    return this._sessions().filter(session => {
      const sessionDate = new Date(session.session_date).toISOString().split('T')[0];
      return sessionDate === dateString;
    });
  }

  addSession(session: Omit<Session, 'id' | 'created_at' | 'updated_at'>): void {
    const newSession: Session = {
      ...session,
      id: Math.max(...this._sessions().map(s => s.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this._sessions.update(sessions => [...sessions, newSession]);
  }

  updateSession(id: number, updates: Partial<Session>): void {
    this._sessions.update(sessions =>
      sessions.map(session =>
        session.id === id
          ? { ...session, ...updates, updated_at: new Date().toISOString() }
          : session
      )
    );
  }

  deleteSession(id: number): void {
    this._sessions.update(sessions => sessions.filter(session => session.id !== id));
  }
}
