// API Response interfaces for patient detail endpoint
export interface PatientDetailResponse {
  success: boolean;
  data: PatientDetailData;
}

export interface PatientDetailData {
  PatientResume: PatientResume;
  PatientData: PatientData;
  PatientMedicalRecord: any[];
  PatientSessions: PatientSession[];
  PatientInvoice: any[];
}

export interface PatientResume {
  id: number;
  email: string;
  phone: string;
  PatientSessionsStatus: {
    completed_sessions: string;
    scheduled_sessions: string;
    cancelled_sessions: string;
  };
  PatientResumeSessions: PatientResumeSession[];
  PatientResumeInvoice: {
    total_spent_current_year: string;
    invoices_issued: number;
  };
}

export interface PatientResumeSession {
  idsession: number;
  tipo: string;
  fecha: string; // "15/01/2025"
  precio: string;
  metodo_pago: string;
}

export interface PatientSession {
  id: number;
  fecha: string; // "2025-07-29"
  clinica: string;
  estado: 'programada' | 'finalizada' | 'cancelada';
  precio: string;
  tipo_pago: string;
  notas: string;
}

export interface PatientData {
  nombre: string;
  dni: string;
  fecha_nacimiento: string; // "1995-01-14"
  estado: string; // "en curso"
  email: string;
  telefono: string;
  direccion: string; // "Calle Mayor 101 1A Valencia Valencia 46002"
  genero: 'M' | 'F' | 'O';
  ocupacion: string;
  clinic_id: number;
  fecha_inicio_tratamiento: string; // "2025-05-12"
  menor_edad: number; // 0 or 1
}

// Helper functions for data transformation
export class PatientDetailUtils {
  static transformPatientData(apiData: PatientData): Patient {
    // Split address into components (basic parsing)
    const addressParts = apiData.direccion.split(' ');

    return {
      id: undefined, // Will be set from PatientResume
      first_name: apiData.nombre.split(' ')[0] || '',
      last_name: apiData.nombre.split(' ').slice(1).join(' ') || '',
      email: apiData.email,
      phone: apiData.telefono,
      dni: apiData.dni,
      gender: apiData.genero,
      occupation: apiData.ocupacion,
      birth_date: apiData.fecha_nacimiento,
      street: addressParts[0] + ' ' + addressParts[1] || '',
      street_number: addressParts[2] || '',
      door: addressParts[3] || '',
      postal_code: addressParts[addressParts.length - 1] || '',
      city: addressParts[addressParts.length - 3] || '',
      province: addressParts[addressParts.length - 2] || '',
      clinic_id: apiData.clinic_id,
      treatment_start_date: apiData.fecha_inicio_tratamiento,
      status: apiData.estado as 'en curso' | 'fin del tratamiento' | 'en pausa' | 'abandono' | 'derivación',
      is_minor: apiData.menor_edad === 1
    };
  }

  static transformResumeSessionToSession(resumeSession: PatientResumeSession): Session {
    return {
      id: resumeSession.idsession.toString(),
      patientId: 0, // Will be set separately
      professionalName: 'Dr. García López', // Default for now
      type: resumeSession.tipo,
      date: this.parseSpanishDate(resumeSession.fecha),
      price: parseFloat(resumeSession.precio),
      paymentMethod: this.translatePaymentMethod(resumeSession.metodo_pago),
      status: 'completed' // Resume sessions are completed by default
    };
  }

  static parseSpanishDate(dateStr: string): Date {
    // Convert "15/01/2025" to Date
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
    return new Date(year, month - 1, day);
  }

  static translatePaymentMethod(method: string): string {
    const methodMap: Record<string, string> = {
      'efectivo': 'cash',
      'tarjeta': 'card',
      'transferencia': 'transfer',
      'bizum': 'bizum',
      'pendiente': 'pending'
    };
    return methodMap[method] || method;
  }

  static getSessionType(resumeSessions: PatientResumeSession[]): string {
    // Determine session type based on most common type in sessions
    const types = resumeSessions.map(s => s.tipo);
    const presencial = types.filter(t => t.toLowerCase().includes('presencial')).length;
    const online = types.filter(t => t.toLowerCase().includes('online')).length;

    if (presencial > online) return 'Presencial';
    if (online > presencial) return 'Online';
    return 'Mixta';
  }
}

// Compatible interface for existing PatientSummary component
export interface Session {
  id: string;
  patientId: number;
  professionalName: string;
  type: string;
  date: Date;
  price: number;
  paymentMethod: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

export interface Invoice {
  id: string;
  patientId: number;
  patientName: string;
  patientDni: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Bonus {
  id: string;
  patientId: number;
  patientName: string;
  type: string;
  amount: number;
  remaining: number;
  expiryDate: Date;
  status: 'active' | 'expired' | 'used';
}

// Import the existing Patient interface
import { Patient } from './patient.model';