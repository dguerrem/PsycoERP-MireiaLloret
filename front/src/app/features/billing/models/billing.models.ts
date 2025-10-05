/**
 * Modelos de datos para el módulo de facturación
 */

export interface ClinicTotal {
  clinic_name: string;
  total_sessions: number;
  total_gross: number;
  clinic_percentage: number;
  total_net: number;
}

export interface InvoiceKPIs {
  filters_applied: {
    month: number;
    year: number;
  };
  card1_total_invoices_issued: number;
  card2_total_gross_historic: number;
  card3_total_gross_filtered: number;
  card4_total_net_filtered: number;
  card5_total_net_by_clinic: ClinicTotal[];
}

export interface ClinicInfo {
  clinic_name: string;
  color: string;
}

export interface PendingInvoice {
  patient_id: number;
  patient_full_name: string;
  dni: string;
  email: string;
  clinic_name: string;
  clinics: ClinicInfo[]; // Lista de clínicas donde tiene sesiones
  session_ids: number[];
  pending_sessions_count: number;
  total_gross: number;
}

export interface PendingInvoicesResponse {
  filters_applied: {
    month: number;
    year: number;
  };
  pending_invoices: PendingInvoice[];
}

export interface ExistingInvoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  patient_full_name: string;
  dni: string;
  sessions_count: number;
  total: number;
}

export interface ExistingInvoicesResponse {
  filters_applied: {
    month: number;
    year: number;
  };
  total_invoices: number;
  invoices: ExistingInvoice[];
}

export interface ApiResponse<T> {
  data: T;
}

/**
 * Request para crear una factura individual
 */
export interface CreateInvoiceRequest {
  invoice_number: string;
  invoice_date: string;
  patient_id: number;
  session_ids: number[];
  concept: string;
}

/**
 * Request para crear facturas en bulk
 */
export type CreateBulkInvoicesRequest = CreateInvoiceRequest[];

/**
 * Response de creación de factura
 */
export interface CreateInvoiceResponse {
  success: boolean;
  message: string;
  invoice_id?: number;
}
