import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionData, SessionUtils } from '../../../../shared/models/session.model';
import { CLINIC_CONFIGS, ClinicConfig } from '../../../../shared/models/clinic-config.model';

/**
 * Session popup component displaying session details with tabs
 *
 * Features:
 * - Tabbed interface (Information/Clinical History)
 * - Read-only form fields matching React UI
 * - Medical records display
 * - Responsive design with exact React styling
 */
@Component({
  selector: 'app-session-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionPopupComponent {
  @Input({ required: true }) sessionData!: SessionData;
  @Output() close = new EventEmitter<void>();

  readonly clinicConfigs = CLINIC_CONFIGS;
  readonly activeTab = signal<'info' | 'clinical'>('info');
  readonly dropdownStates = signal({
    clinic: false,
    sessionType: false,
    paymentMethod: false,
  });
  readonly editingNote = signal<{
    id?: string;
    title: string;
    content: string;
    isEditing: boolean;
  } | null>(null);
  readonly isAddingNewNote = signal(false);

  // Session types and payment methods for dropdowns
  readonly sessionTypes = [
    'Terapia Individual',
    'Terapia de Pareja',
    'Terapia Familiar',
    'Terapia Grupal',
    'Evaluación Psicológica',
    'Consulta de Seguimiento',
  ];

  readonly paymentMethods = [
    { value: 'cash' as const, label: 'Efectivo' },
    { value: 'card' as const, label: 'Tarjeta' },
    { value: 'transfer' as const, label: 'Transferencia' },
    { value: 'bizum' as const, label: 'Bizum' },
  ];

  /**
   * Handles backdrop click to close modal
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  /**
   * Emits close event to parent component
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Gets clinic config by ID
   */
  getClinicConfig(clinicId: number): ClinicConfig {
    return (
      this.clinicConfigs.find((config) => config.id === clinicId) ||
      this.clinicConfigs[0]
    );
  }

  /**
   * Gets clinic config from session data
   */
  getClinicConfigFromSessionData(): ClinicConfig {
    return this.getClinicConfig(
      this.sessionData.SessionDetailData.ClinicDetailData.clinic_id
    );
  }

  /**
   * Gets patient name from session data
   */
  getPatientName(): string {
    return this.sessionData.SessionDetailData.PatientData.name;
  }

  /**
   * Gets clinic name from session data
   */
  getClinicName(): string {
    return this.sessionData.SessionDetailData.ClinicDetailData.clinic_name;
  }

  /**
   * Formats date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Formats time for display
   */
  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  /**
   * Gets status text for display
   */
  getStatusText(): string {
    if (this.sessionData.SessionDetailData.cancelled) {
      return 'Cancelada';
    }
    if (this.sessionData.SessionDetailData.no_show) {
      return 'No Asistió';
    }
    if (this.sessionData.SessionDetailData.completed) {
      return 'Completada';
    }
    return 'Programada';
  }

  /**
   * Gets status badge CSS classes
   */
  getStatusBadgeClass(): string {
    return SessionUtils.getStatusBadgeClass(this.sessionData);
  }

  /**
   * Gets payment status text
   */
  getPaymentStatusText(): string {
    return SessionUtils.formatPaymentStatus(
      this.sessionData.SessionDetailData.payment_status
    );
  }

  /**
   * Gets payment status badge CSS classes
   */
  getPaymentStatusBadgeClass(): string {
    const status = this.sessionData.SessionDetailData.payment_status;
    const paymentStatusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-orange-100 text-orange-800',
    };
    return (
      paymentStatusClasses[status as keyof typeof paymentStatusClasses] ||
      paymentStatusClasses.pending
    );
  }

  /**
   * Gets payment method text
   */
  getPaymentMethodText(): string {
    return SessionUtils.formatPaymentMethod(
      this.sessionData.SessionDetailData.payment_method
    );
  }

  /**
   * Formats price for display
   */
  formatPrice(): string {
    return SessionUtils.formatPrice(this.sessionData.SessionDetailData.price);
  }

  /**
   * Gets medical records from session data
   */
  getMedicalRecords(): Array<{ title: string; content: string; date: string }> {
    return this.sessionData.SessionDetailData.MedicalRecordData || [];
  }

  /**
   * Formats medical record date
   */
  formatMedicalRecordDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Checks if session has notes
   */
  hasNotes(): boolean {
    return !!this.sessionData.SessionDetailData.notes;
  }

  /**
   * Checks if session has medical records
   */
  hasMedicalRecords(): boolean {
    return this.getMedicalRecords().length > 0;
  }

  /**
   * Sets the active tab
   */
  setActiveTab(tab: 'info' | 'clinical'): void {
    this.activeTab.set(tab);
  }

  /**
   * Gets short version of session type for badge
   */
  getSessionTypeShort(): string {
    const type = this.sessionData.SessionDetailData.type;
    const shortTypes: { [key: string]: string } = {
      'Terapia Individual': 'individual',
      'Terapia de Pareja': 'pareja',
      'Terapia Familiar': 'familiar',
      'Terapia Grupal': 'grupal',
      'Evaluación Psicológica': 'evaluación',
      'Consulta de Seguimiento': 'seguimiento',
    };
    return shortTypes[type] || type.toLowerCase();
  }

  /**
   * Formats time for input fields (HH:MM format)
   */
  formatTimeForInput(time: string): string {
    // If time already in HH:MM:SS format, convert to HH:MM
    if (time.includes(':')) {
      return time.substring(0, 5);
    }
    return time;
  }

  /**
   * Gets clinic background color as hex value
   */
  getClinicColorHex(): string {
    const bgClass = this.getClinicConfigFromSessionData().backgroundColor;

    // Map Tailwind bg classes to hex colors
    const colorMap: { [key: string]: string } = {
      'bg-[#0891b2]': '#0891b2',
      'bg-green-500': '#10b981',
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#a855f7',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-orange-500': '#f97316',
      'bg-teal-500': '#14b8a6',
    };

    return colorMap[bgClass] || '#6366f1'; // Default to indigo if not found
  }

  /**
   * Toggles dropdown state
   */
  toggleDropdown(dropdown: 'clinic' | 'sessionType' | 'paymentMethod'): void {
    const current = this.dropdownStates();
    this.dropdownStates.set({
      ...current,
      [dropdown]: !current[dropdown],
    });
  }

  /**
   * Toggles completed checkbox
   */
  toggleCompleted(): void {
    this.sessionData.SessionDetailData.completed =
      !this.sessionData.SessionDetailData.completed;
  }

  /**
   * Updates session clinic
   */
  updateClinic(clinicId: number): void {
    this.sessionData.SessionDetailData.ClinicDetailData.clinic_id = clinicId;
    const clinic = this.getClinicConfig(clinicId);
    this.sessionData.SessionDetailData.ClinicDetailData.clinic_name =
      clinic.name;
    this.toggleDropdown('clinic');
  }

  /**
   * Updates session type
   */
  updateSessionType(type: string): void {
    this.sessionData.SessionDetailData.type = type;
    this.toggleDropdown('sessionType');
  }

  /**
   * Updates payment method
   */
  updatePaymentMethod(method: 'cash' | 'card' | 'transfer' | 'bizum'): void {
    this.sessionData.SessionDetailData.payment_method = method;
    this.toggleDropdown('paymentMethod');
  }

  /**
   * Starts editing a note
   */
  startEditingNote(
    record: { title: string; content: string; date: string },
    index: number
  ): void {
    this.editingNote.set({
      id: `${index}`,
      title: record.title,
      content: record.content,
      isEditing: true,
    });
  }

  /**
   * Cancels note editing
   */
  cancelEditingNote(): void {
    this.editingNote.set(null);
  }

  /**
   * Saves edited note
   */
  saveEditedNote(): void {
    const note = this.editingNote();
    if (!note) return;

    // Update the medical record in session data
    const records = this.getMedicalRecords();
    const index = parseInt(note.id || '0');
    if (records[index]) {
      records[index].title = note.title;
      records[index].content = note.content;
    }

    this.editingNote.set(null);
  }

  /**
   * Starts adding a new note
   */
  startAddingNewNote(): void {
    this.isAddingNewNote.set(true);
    this.editingNote.set({
      title: 'Nueva nota',
      content: '',
      isEditing: true,
    });
  }

  /**
   * Cancels adding new note
   */
  cancelAddingNewNote(): void {
    this.isAddingNewNote.set(false);
    this.editingNote.set(null);
  }

  /**
   * Saves new note
   */
  saveNewNote(): void {
    const note = this.editingNote();
    if (!note || !note.title.trim() || !note.content.trim()) return;

    // Add new record to session data
    if (!this.sessionData.SessionDetailData.MedicalRecordData) {
      this.sessionData.SessionDetailData.MedicalRecordData = [];
    }

    this.sessionData.SessionDetailData.MedicalRecordData.push({
      title: note.title,
      content: note.content,
      date: new Date().toISOString(),
    });

    this.isAddingNewNote.set(false);
    this.editingNote.set(null);
  }
}
