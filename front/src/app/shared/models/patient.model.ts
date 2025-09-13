export interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  dni: string;
  status: string;
  session_type: string;
  address: string;
  birth_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
  current_medication: string;
  allergies: string;
  referred_by: string;
  insurance_provider: string;
  insurance_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PatientsResponse {
  data: Patient[];
}
