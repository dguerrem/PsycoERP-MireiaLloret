import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ReminderCardComponent } from './components/reminder-card/reminder-card.component';
import { RecordatoriosService } from './services/recordatorios.service';

@Component({
  selector: 'app-reminder',
  standalone: true,
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SectionHeaderComponent,
    ReminderCardComponent
  ]
})
export class ReminderComponent implements OnInit {
  private recordatoriosService = inject(RecordatoriosService);

  protected recordatorios = this.recordatoriosService.all;
  protected isLoading = this.recordatoriosService.isLoading;
  protected sendingStates = this.recordatoriosService.isSending;
  protected error = this.recordatoriosService.error;

  ngOnInit(): void {
    this.recordatoriosService.loadRecordatorios();
  }

  protected async onSendReminder(id: string): Promise<void> {
    try {
      await this.recordatoriosService.sendReminder(id);
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
    }
  }

  protected onRetry(): void {
    this.recordatoriosService.loadRecordatorios();
  }

  protected isRecordatorioLoading(id: string): boolean {
    return this.recordatoriosService.isRecordatorioLoading(id);
  }
}
