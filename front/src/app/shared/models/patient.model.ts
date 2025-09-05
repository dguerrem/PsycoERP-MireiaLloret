export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dni: string;
  status: string;                    // "active", "inactive", etc.
  session_type: string;              // "individual", "group", etc.
  address: string;
  birth_date: string;                // "1985-03-15"
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
  current_medication: string;
  allergies: string;
  referred_by: string;
  insurance_provider: string;
  insurance_number: string;
  notes: string;
  created_at: string;               // "2025-08-25"
  updated_at: string;               // "2025-08-25T19:17:42.000Z"
}

export interface PatientsResponse {
  data: Patient[];
}