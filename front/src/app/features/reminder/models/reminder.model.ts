// Modelo para uso interno en el componente
export interface Recordatorio {
  id: string;
  sessionId: number;
  patientName: string;
  startTime: string;
  endTime: string;
  clinicColor: string;
  sent: boolean;
}

// Modelo que llega del endpoint GET /api/reminders/pending
export interface PendingReminderFromAPI {
  session_id: number;
  start_time: string;
  end_time: string;
  patient_name: string;
  reminder_sent: boolean;
}

// Respuesta del endpoint GET /api/reminders/pending
export interface PendingRemindersResponse {
  data: PendingReminderFromAPI[];
}

// Respuesta del endpoint POST /api/reminders
export interface SendReminderResponse {
  data: {
    whatsapp_deeplink: string;
  };
}