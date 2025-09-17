import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Recordatorio, PendingReminderFromAPI, PendingRemindersResponse, SendReminderResponse } from '../models/reminder.model';


@Injectable({ providedIn: 'root' })
export class RecordatoriosService {
  private http = inject(HttpClient);

  private recordatorios = signal<Recordatorio[]>([]);
  private loading = signal(false);
  private sendingReminder = signal<Set<string>>(new Set());
  private errorState = signal<string | null>(null);

  get all() {
    return this.recordatorios.asReadonly();
  }

  get isLoading() {
    return this.loading.asReadonly();
  }

  get isSending() {
    return this.sendingReminder.asReadonly();
  }

  get error() {
    return this.errorState.asReadonly();
  }

  private mapRecordatorioFromAPI(apiData: PendingReminderFromAPI): Recordatorio {
    return {
      id: apiData.session_id.toString(),
      sessionId: apiData.session_id,
      patientName: apiData.patient_name,
      startTime: apiData.start_time,
      endTime: apiData.end_time,
      clinicColor: this.getRandomColor(),
      sent: apiData.reminder_sent
    };
  }

  private getRandomColor(): string {
    const colors = [
      'bg-gradient-to-br from-cyan-500 to-cyan-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-rose-500 to-rose-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-orange-500 to-orange-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private openWhatsAppDirectly(whatsappUrl: string): void {
    // Opción 1: Crear enlace invisible y hacer click (más limpio)
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Opción 2 alternativa: Usar window.location.href en móviles
    // if (this.isMobileDevice()) {
    //   window.location.href = whatsappUrl;
    // } else {
    //   // En desktop seguir usando window.open
    //   window.open(whatsappUrl, '_blank');
    // }
  }

  // Método auxiliar para detectar dispositivos móviles
  // private isMobileDevice(): boolean {
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // }

  async loadRecordatorios(): Promise<void> {
    this.loading.set(true);
    this.errorState.set(null);

    try {
      const response = await lastValueFrom(
        this.http.get<PendingRemindersResponse>('/reminders/pending')
      );

      if (response.data) {
        const mappedRecordatorios = response.data.map(item => this.mapRecordatorioFromAPI(item));
        this.recordatorios.set(mappedRecordatorios);
      } else {
        this.errorState.set('Error al cargar los recordatorios');
        this.recordatorios.set([]);
      }
    } catch (error) {
      console.error('Error loading recordatorios:', error);
      const errorMessage = error instanceof HttpErrorResponse
        ? `Error ${error.status}: ${error.message}`
        : 'Error de conexión';
      this.errorState.set(errorMessage);
      this.recordatorios.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async sendReminder(id: string): Promise<void> {
    this.sendingReminder.update(set => new Set([...set, id]));
    this.errorState.set(null);

    try {
      const response = await lastValueFrom(
        this.http.post<SendReminderResponse>('/reminders', {
          session_id: parseInt(id)
        })
      );

      if (response.data) {
        // Actualizar estado local
        this.recordatorios.update(recordatorios =>
          recordatorios.map(recordatorio =>
            recordatorio.id === id ? { ...recordatorio, sent: true } : recordatorio
          )
        );

        // Abrir WhatsApp sin crear nueva pestaña
        this.openWhatsAppDirectly(response.data.whatsapp_deeplink);
      } else {
        throw new Error('Error al enviar recordatorio');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      const errorMessage = error instanceof HttpErrorResponse
        ? `Error ${error.status}: ${error.message}`
        : error instanceof Error
        ? error.message
        : 'Error de conexión';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.sendingReminder.update(set => {
        const newSet = new Set(set);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  isRecordatorioLoading(id: string): boolean {
    return this.sendingReminder().has(id);
  }
}