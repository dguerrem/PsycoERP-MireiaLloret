export interface Patient {
  id?: number;

  // Datos personales básicos
  name: string;
  surname?: string;
  email: string;
  phone: string;
  dni: string;
  birth_date: string;
  gender?: string;
  occupation?: string;

  // Dirección completa
  street?: string;
  number?: string;
  door?: string;
  postal_code?: string;
  city?: string;
  province?: string;

  // Información del tratamiento
  session_price?: number;
  clinic_id?: string | number;
  treatment_start_date?: string;
  treatment_status?: string;

  // Campos calculados/automáticos
  is_minor?: boolean;

  // Campos heredados (mantenemos para compatibilidad)
  status?: string;
  session_type?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  current_medication?: string;
  allergies?: string;
  referred_by?: string;
  insurance_provider?: string;
  insurance_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientsResponse {
  data: Patient[];
}
