export interface SessionResponse {
  data: SessionData[];
}

// Interface for creating a new session
export interface CreateSessionRequest {
  patient_id: number;
  clinic_id: number;
  session_date: string; // "2025-09-22"
  start_time: string;   // "19:12:21.989Z"
  end_time: string;     // "19:12:21.989Z"
  mode: 'presencial' | 'online';
  status: 'programada' | 'finalizada' | 'cancelada';
  price: number;
  payment_method: 'bizum' | 'transferencia' | 'tarjeta' | 'efectivo' | 'pendiente';
  notes: string;
}

export interface SessionData {
  SessionDetailData: {
    session_id: number;
    session_date: string; // "2024-12-15"
    start_time: string;   // "09:00:00"
    end_time: string;     // "10:00:00"
    type: string;         // "Terapia Individual"
    mode: 'online' | 'presencial'; // Added mode to new DTO
    price: number;        // 60
    payment_method: 'bizum' | 'transferencia' | 'tarjeta' | 'efectivo' | 'pendiente';
    status: 'programada' | 'finalizada' | 'cancelada'; // Added unified status field
    completed: boolean;     // true/false
    cancelled: boolean;     // true/false - to handle cancelled sessions
    no_show: boolean;       // true/false - to handle no-show sessions
    sended: boolean;        // true/false - to handle reminder sent status
    notes?: string;         // "Primera sesión del paciente"
    created_at: string;     // ISO timestamp
    updated_at: string;     // ISO timestamp
    PatientData: {
      id: number;           // 1
      name: string;         // "Juan Pérez García"
    };
    ClinicDetailData: {
      clinic_id: number;    // 1
      clinic_name: string;  // "Clínica Psicológica Centro"
    };
    MedicalRecordData: Array<{
      title: string;        // "Sesión inicial de evaluación"
      content: string;      // "El paciente se muestra colaborativo..."
      date: string;         // "2024-12-15 14:30:00"
    }>;
  };
}

// Helper type for session status
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

// Utility functions for status handling
export class SessionUtils {
  static getSessionStatus(sessionData: SessionData): SessionStatus {
    const detail = sessionData.SessionDetailData;
    if (detail.cancelled) return 'cancelled';
    if (detail.no_show) return 'no_show';
    if (detail.completed) return 'completed';
    return 'scheduled';
  }

  static getStatusText(sessionData: SessionData): string {
    const status = this.getSessionStatus(sessionData);
    const statusTexts = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No asistió'
    };
    return statusTexts[status];
  }

  static getStatusBadgeClass(sessionData: SessionData): string {
    const status = this.getSessionStatus(sessionData);
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status];
  }

  static formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }

  static formatPaymentMethod(method: string): string {
    const methods = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'transferencia': 'Transferencia',
      'bizum': 'Bizum',
      'pendiente': 'Pendiente'
    };
    return methods[method as keyof typeof methods] || method;
  }

  static formatPaymentStatus(status: string): string {
    const statuses = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'partial': 'Parcial'
    };
    return statuses[status as keyof typeof statuses] || status;
  }
}
