import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicalNote, CreateClinicalNoteRequest, UpdateClinicalNoteRequest } from '../models/clinical-note.interface';
import { Patient } from '../../../shared/models/patient.model';
import { PatientMedicalRecord } from '../../../shared/models/patient-detail.model';
import { ClinicalNotesService } from '../services/clinical-notes.service';

/**
 * Patient Clinical History Component
 *
 * Manages patient clinical notes with create/update operations.
 * Receives initial data from parent and handles POST/PUT to API.
 *
 * Usage:
 *    <app-patient-clinical-history
 *      [patient]="patient"
 *      [medicalRecords]="patientMedicalRecord()">
 *    </app-patient-clinical-history>
 *
 * Features:
 * - Create and update clinical notes via API
 * - Search/filter notes
 * - Voice recording for note content
 * - Emits events when data changes to refresh parent
 */
@Component({
  selector: 'app-patient-clinical-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-clinical-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientClinicalHistoryComponent implements OnInit, OnChanges {
  private clinicalNotesService = inject(ClinicalNotesService);

  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) medicalRecords!: PatientMedicalRecord[];
  @Output() dataChanged = new EventEmitter<void>();

  // Notes transformed from medical records
  private notes = signal<ClinicalNote[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);

  // Señales para el estado local
  searchTerm = signal('');
  isCreatingNote = signal(false);
  editingNote = signal<ClinicalNote | null>(null);
  newNote = signal<Partial<CreateClinicalNoteRequest>>({
    title: '',
    content: '',
    tags: []
  });

  // Funcionalidad del micrófono
  isRecording = signal(false);
  private mediaRecorder: MediaRecorder | null = null;
  private recognition: any = null;

  ngOnInit(): void {
    // Transform initial data
    if (this.medicalRecords) {
      this.transformMedicalRecords(this.medicalRecords);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update when parent data changes
    if (changes['medicalRecords'] && this.medicalRecords) {
      this.transformMedicalRecords(this.medicalRecords);
    }
  }

  private transformMedicalRecords(records: PatientMedicalRecord[]): void {
    console.log('📥 Received medical records from parent:', records);

    const transformed = records.map((record) => {
      const noteId = record.id ? record.id.toString() : `temp-${Date.now()}`;
      console.log('🔄 Transforming record ID:', record.id, '→', noteId);

      return {
        id: noteId,
        title: record.titulo,
        content: record.contenido,
        date: this.parseDateString(record.fecha),
        tags: [],
        sessionId: '',
        createdBy: 'Sistema',
        updatedAt: this.parseDateString(record.fecha)
      };
    });

    console.log('✅ Transformed notes:', transformed);
    this.notes.set(transformed);
  }

  private parseDateString(dateStr: string): Date {
    // Parse "2025-08-26 07:48:17" format
    const [datePart] = dateStr.split(' ');
    return new Date(datePart);
  }

  // Computed para notas filtradas
  filteredNotes = computed(() => {
    const notes = this.notes();
    const search = this.searchTerm().toLowerCase();

    if (!search) return notes;

    return notes.filter(note =>
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    );
  });

  // Computed para notas ordenadas
  sortedNotes = computed(() => {
    return this.filteredNotes().sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onCreateNote() {
    this.isCreatingNote.set(true);
    this.editingNote.set(null);
    this.newNote.set({
      title: '',
      content: '',
      tags: []
    });
  }

  onEditNote(note: ClinicalNote) {
    console.log('✏️ Editing note - Full object:', note);
    console.log('📌 Note ID:', note.id, '(type:', typeof note.id, ')');

    this.editingNote.set(note);
    this.isCreatingNote.set(false);
    this.newNote.set({
      title: note.title,
      content: note.content,
      tags: []
    });
  }

  onTitleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newNote.update(note => ({ ...note, title: target.value }));
  }

  onContentChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.newNote.update(note => ({ ...note, content: target.value }));
  }


  onSaveNote() {
    const note = this.newNote();
    const editingNote = this.editingNote();

    // Validation
    if (!note.title || !note.content) {
      alert('Por favor, completa el título y el contenido de la nota.');
      return;
    }

    if (!this.patient.id) {
      alert('Error: No se puede guardar la nota sin un ID de paciente.');
      return;
    }

    this.isSaving.set(true);

    if (editingNote) {
      // Update existing note
      console.log('💾 Saving edited note - editingNote.id:', editingNote.id);

      const noteIdNumber = parseInt(editingNote.id);
      console.log('🔢 Parsed ID:', noteIdNumber, '(isNaN:', isNaN(noteIdNumber), ')');

      if (isNaN(noteIdNumber) || noteIdNumber === 0) {
        console.error('❌ Invalid note ID. editingNote:', editingNote);
        alert('Error: ID de nota inválido para actualización. ID: ' + editingNote.id);
        this.isSaving.set(false);
        return;
      }

      console.log('📤 Calling API PUT with:', {
        id: noteIdNumber,
        title: note.title,
        content: note.content?.substring(0, 30)
      });

      this.clinicalNotesService.updateClinicalNote({
        id: noteIdNumber,
        title: note.title,
        content: note.content
      }).subscribe({
        next: (response) => {
          console.log('✅ Note updated successfully:', response);
          this.isSaving.set(false);
          this.onCancelEdit();
          // Notify parent to reload data
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('❌ Error updating note:', error);
          alert('Error al actualizar la nota. Por favor, intenta de nuevo.');
          this.isSaving.set(false);
        }
      });
    } else {
      // Create new note
      this.clinicalNotesService.createClinicalNote({
        patient_id: this.patient.id,
        title: note.title,
        content: note.content
      }).subscribe({
        next: (response) => {
          console.log('✅ Note created successfully:', response);
          this.isSaving.set(false);
          this.onCancelEdit();
          // Notify parent to reload data
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('❌ Error creating note:', error);
          alert('Error al crear la nota. Por favor, intenta de nuevo.');
          this.isSaving.set(false);
        }
      });
    }
  }

  onCancelEdit() {
    this.isCreatingNote.set(false);
    this.editingNote.set(null);
    this.newNote.set({
      title: '',
      content: '',
      tags: []
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  toggleRecording(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isRecording()) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private async startRecording() {
    try {
      // Verificar soporte para Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'es-ES';

      let finalTranscript = '';
      const currentContent = this.newNote().content || '';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Actualizar el contenido en tiempo real
        const newContent = currentContent + finalTranscript + interimTranscript;
        this.newNote.update(note => ({ ...note, content: newContent }));
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        this.isRecording.set(false);

        if (event.error === 'not-allowed') {
          alert('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.');
        }
      };

      this.recognition.onend = () => {
        this.isRecording.set(false);
      };

      // Iniciar reconocimiento
      this.recognition.start();
      this.isRecording.set(true);

    } catch (error) {
      console.error('Error iniciando grabación:', error);
      alert('Error al acceder al micrófono. Verifica los permisos.');
    }
  }

  private stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.isRecording.set(false);
  }
}