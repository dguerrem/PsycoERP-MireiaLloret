export interface Session {
  id: number;
  patient_id: number;
  clinic_id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  mode: 'Online' | 'Presencial';
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  price: string;
  payment_method: 'cash' | 'card' | 'transfer' | 'bizum';
  payment_status: 'pending' | 'paid' | 'partial';
  notes?: string;
  created_at: string;
  updated_at: string;
}