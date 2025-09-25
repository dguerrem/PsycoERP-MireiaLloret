import { Injectable, signal, computed } from '@angular/core';
import { SessionData, SessionResponse } from '../../../shared/models/session.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _currentDate = signal(new Date());
  private _currentView = signal<'week' | 'month'>('week');
  private _selectedSessionData = signal<SessionData | null>(null);
  private _sessionData = signal<SessionData[]>([
    {
      SessionDetailData: {
        session_id: 1,
        session_date: "2025-08-30",
        start_time: "09:00:00",
        end_time: "10:00:00",
        type: "Terapia Individual",
        mode: "Presencial",
        price: 60,
        payment_method: "tarjeta",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Primera sesión del mes",
        created_at: "2025-08-25T10:00:00.000Z",
        updated_at: "2025-08-25T10:00:00.000Z",
        PatientData: {
          id: 101,
          name: "Ana García"
        },
        ClinicDetailData: {
          clinic_id: 1,
          clinic_name: "Clínica Norte"
        },
        MedicalRecordData: [
          {
            title: "Evaluación inicial",
            content: "Paciente presenta síntomas de ansiedad generalizada. Se observa tensión muscular y dificultad para relajarse. Refiere preocupaciones constantes sobre el trabajo y la familia.",
            date: "2025-08-15 09:30:00"
          },
          {
            title: "Sesión de seguimiento",
            content: "Mejora notable en técnicas de respiración. Paciente reporta menor frecuencia de episodios de ansiedad. Continuar con ejercicios de mindfulness.",
            date: "2025-08-22 09:30:00"
          },
          {
            title: "Evaluación de progreso",
            content: "El paciente demuestra aplicación consistente de las técnicas aprendidas. Se observa reducción significativa en los niveles de ansiedad reportados. Ha logrado implementar rutinas de autocuidado efectivas.",
            date: "2025-08-30 09:30:00"
          }
        ]
      }
    },
    {
      SessionDetailData: {
        session_id: 2,
        session_date: "2025-08-30",
        start_time: "11:00:00",
        end_time: "12:00:00",
        type: "Terapia de Pareja",
        mode: "Online",
        price: 80,
        payment_method: "transferencia",
        payment_status: "paid",
        completed: true,
        cancelled: false,
        no_show: false,
        sended: true,
        notes: "Sesión completada con éxito",
        created_at: "2025-08-25T11:00:00.000Z",
        updated_at: "2025-08-30T12:00:00.000Z",
        PatientData: {
          id: 102,
          name: "Carlos López"
        },
        ClinicDetailData: {
          clinic_id: 2,
          clinic_name: "Clínica Sur"
        },
        MedicalRecordData: [
          {
            title: "Seguimiento de pareja",
            content: "Se observan mejoras en la comunicación",
            date: "2025-08-30 11:45:00"
          }
        ]
      }
    },
    {
      SessionDetailData: {
        session_id: 3,
        session_date: "2025-08-31",
        start_time: "15:00:00",
        end_time: "16:00:00",
        type: "Terapia Individual",
        mode: "Presencial",
        price: 65,
        payment_method: "efectivo",
        payment_status: "pending",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Paciente nuevo",
        created_at: "2025-08-26T14:00:00.000Z",
        updated_at: "2025-08-26T14:00:00.000Z",
        PatientData: {
          id: 103,
          name: "María Rodríguez"
        },
        ClinicDetailData: {
          clinic_id: 3,
          clinic_name: "Clínica Centro"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 4,
        session_date: "2025-09-01",
        start_time: "10:30:00",
        end_time: "11:30:00",
        type: "Terapia Familiar",
        mode: "Online",
        price: 90,
        payment_method: "tarjeta",
        payment_status: "pending",
        completed: false,
        cancelled: true,
        no_show: false,
        sended: true,
        notes: "Cancelada por el paciente",
        created_at: "2025-08-27T09:00:00.000Z",
        updated_at: "2025-08-28T16:30:00.000Z",
        PatientData: {
          id: 104,
          name: "Juan Martínez"
        },
        ClinicDetailData: {
          clinic_id: 4,
          clinic_name: "Clínica Este"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 5,
        session_date: "2025-09-02",
        start_time: "16:00:00",
        end_time: "17:00:00",
        type: "Terapia Individual",
        mode: "Presencial",
        price: 70,
        payment_method: "bizum",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Sesión de seguimiento",
        created_at: "2025-08-28T13:00:00.000Z",
        updated_at: "2025-08-28T13:00:00.000Z",
        PatientData: {
          id: 105,
          name: "Laura Sánchez"
        },
        ClinicDetailData: {
          clinic_id: 5,
          clinic_name: "Clínica Oeste"
        },
        MedicalRecordData: [
          {
            title: "Sesión de seguimiento",
            content: "Progreso satisfactorio en el tratamiento",
            date: "2025-09-02 16:30:00"
          }
        ]
      }
    },
    {
      SessionDetailData: {
        session_id: 6,
        session_date: "2025-09-03",
        start_time: "14:00:00",
        end_time: "15:00:00",
        type: "Terapia Individual",
        mode: "Online",
        price: 60,
        payment_method: "tarjeta",
        payment_status: "paid",
        completed: true,
        cancelled: false,
        no_show: false,
        sended: true,
        notes: "Excelente progreso",
        created_at: "2025-08-29T10:00:00.000Z",
        updated_at: "2025-09-03T15:00:00.000Z",
        PatientData: {
          id: 106,
          name: "Pedro González"
        },
        ClinicDetailData: {
          clinic_id: 1,
          clinic_name: "Clínica Norte"
        },
        MedicalRecordData: [
          {
            title: "Evaluación de progreso",
            content: "El paciente muestra una evolución muy positiva",
            date: "2025-09-03 14:30:00"
          }
        ]
      }
    },
    {
      SessionDetailData: {
        session_id: 7,
        session_date: "2025-09-04",
        start_time: "09:30:00",
        end_time: "10:30:00",
        type: "Terapia Individual",
        mode: "Presencial",
        price: 65,
        payment_method: "tarjeta",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Primera sesión después de vacaciones",
        created_at: "2025-08-30T12:00:00.000Z",
        updated_at: "2025-08-30T12:00:00.000Z",
        PatientData: {
          id: 107,
          name: "Carmen Díaz"
        },
        ClinicDetailData: {
          clinic_id: 2,
          clinic_name: "Clínica Sur"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 8,
        session_date: "2025-09-04",
        start_time: "11:00:00",
        end_time: "12:00:00",
        type: "Terapia de Pareja",
        mode: "Online",
        price: 80,
        payment_method: "transferencia",
        payment_status: "pending",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Sesión de seguimiento de pareja",
        created_at: "2025-08-30T13:00:00.000Z",
        updated_at: "2025-08-30T13:00:00.000Z",
        PatientData: {
          id: 108,
          name: "Roberto Fernández"
        },
        ClinicDetailData: {
          clinic_id: 3,
          clinic_name: "Clínica Centro"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 9,
        session_date: "2025-09-05",
        start_time: "08:00:00",
        end_time: "09:00:00",
        type: "Evaluación Psicológica",
        mode: "Presencial",
        price: 90,
        payment_method: "bizum",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: true,
        notes: "Evaluación inicial completa",
        created_at: "2025-08-31T09:00:00.000Z",
        updated_at: "2025-08-31T09:00:00.000Z",
        PatientData: {
          id: 109,
          name: "Isabel Moreno"
        },
        ClinicDetailData: {
          clinic_id: 4,
          clinic_name: "Clínica Este"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 10,
        session_date: "2025-09-05",
        start_time: "16:30:00",
        end_time: "17:30:00",
        type: "Terapia Familiar",
        mode: "Presencial",
        price: 85,
        payment_method: "efectivo",
        payment_status: "pending",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Primera sesión familiar",
        created_at: "2025-08-31T14:00:00.000Z",
        updated_at: "2025-08-31T14:00:00.000Z",
        PatientData: {
          id: 110,
          name: "Familia Ruiz"
        },
        ClinicDetailData: {
          clinic_id: 5,
          clinic_name: "Clínica Oeste"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 11,
        session_date: "2025-09-06",
        start_time: "10:00:00",
        end_time: "11:00:00",
        type: "Terapia Individual",
        mode: "Online",
        price: 60,
        payment_method: "tarjeta",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Seguimiento de ansiedad",
        created_at: "2025-09-01T10:00:00.000Z",
        updated_at: "2025-09-01T10:00:00.000Z",
        PatientData: {
          id: 111,
          name: "Miguel Torres"
        },
        ClinicDetailData: {
          clinic_id: 1,
          clinic_name: "Clínica Norte"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 12,
        session_date: "2025-09-06",
        start_time: "15:00:00",
        end_time: "16:00:00",
        type: "Terapia Individual",
        mode: "Presencial",
        price: 70,
        payment_method: "transferencia",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: true,
        notes: "Terapia de duelo",
        created_at: "2025-09-01T11:00:00.000Z",
        updated_at: "2025-09-01T11:00:00.000Z",
        PatientData: {
          id: 112,
          name: "Elena Vásquez"
        },
        ClinicDetailData: {
          clinic_id: 2,
          clinic_name: "Clínica Sur"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 13,
        session_date: "2025-09-07",
        start_time: "09:00:00",
        end_time: "10:00:00",
        type: "Terapia Grupal",
        mode: "Presencial",
        price: 45,
        payment_method: "bizum",
        payment_status: "pending",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Terapia grupal de autoestima",
        created_at: "2025-09-02T08:00:00.000Z",
        updated_at: "2025-09-02T08:00:00.000Z",
        PatientData: {
          id: 113,
          name: "Grupo Autoestima"
        },
        ClinicDetailData: {
          clinic_id: 3,
          clinic_name: "Clínica Centro"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 14,
        session_date: "2025-09-07",
        start_time: "12:00:00",
        end_time: "13:00:00",
        type: "Consulta de Seguimiento",
        mode: "Online",
        price: 50,
        payment_method: "tarjeta",
        payment_status: "paid",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Revisión trimestral",
        created_at: "2025-09-02T09:00:00.000Z",
        updated_at: "2025-09-02T09:00:00.000Z",
        PatientData: {
          id: 114,
          name: "Andrea Jiménez"
        },
        ClinicDetailData: {
          clinic_id: 4,
          clinic_name: "Clínica Este"
        },
        MedicalRecordData: []
      }
    },
    {
      SessionDetailData: {
        session_id: 15,
        session_date: "2025-09-08",
        start_time: "14:00:00",
        end_time: "15:00:00",
        type: "Terapia Individual",
        mode: "Presencial",
        price: 65,
        payment_method: "efectivo",
        payment_status: "pending",
        completed: false,
        cancelled: false,
        no_show: false,
        sended: false,
        notes: "Sesión de relajación",
        created_at: "2025-09-02T10:00:00.000Z",
        updated_at: "2025-09-02T10:00:00.000Z",
        PatientData: {
          id: 115,
          name: "Francisco Luna"
        },
        ClinicDetailData: {
          clinic_id: 5,
          clinic_name: "Clínica Oeste"
        },
        MedicalRecordData: []
      }
    }
  ]);

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

      return sessionData.filter(data => {
        const sessionDate = new Date(data.SessionDetailData.session_date);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    } else {
      const monthDates = this.monthDates();
      const startDate = monthDates[0];
      const endDate = monthDates[41];

      return sessionData.filter(data => {
        const sessionDate = new Date(data.SessionDetailData.session_date);
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

  setSelectedSessionData(sessionData: SessionData | null): void {
    this._selectedSessionData.set(sessionData);
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

  getSessionDataForDate(date: Date): SessionData[] {
    const dateString = date.toISOString().split('T')[0];
    return this._sessionData().filter(data => {
      return data.SessionDetailData.session_date === dateString;
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