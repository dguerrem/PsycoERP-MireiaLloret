import {
  Component,
  ChangeDetectionStrategy,
  Input,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../shared/models/patient.model';

export interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  upload_date: string;
  description?: string;
  file_url?: string;
  patient_id: number;
}

@Component({
  selector: 'app-patient-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-documentation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDocumentationComponent {
  @Input({ required: true }) patient!: Patient;
  @Input() documents: Document[] = [];

  readonly viewingDocument = signal<Document | null>(null);

  // Datos mockeados para la demostración
  readonly mockDocuments: Document[] = [
    {
      id: 1,
      name: 'Consentimiento_Informado.pdf',
      type: 'pdf',
      size: '245 KB',
      upload_date: '2024-01-15',
      description:
        'Consentimiento informado firmado para tratamiento psicológico',
      file_url: 'https://example.com/docs/consent.pdf',
      patient_id: this.patient?.id || 1,
    },
    {
      id: 2,
      name: 'Informe_Medico_Derivacion.pdf',
      type: 'pdf',
      size: '1.2 MB',
      upload_date: '2024-01-10',
      description: 'Informe médico de derivación desde atención primaria',
      file_url: 'https://example.com/docs/medical.pdf',
      patient_id: this.patient?.id || 1,
    },
    {
      id: 3,
      name: 'Test_Ansiedad_Beck.pdf',
      type: 'pdf',
      size: '890 KB',
      upload_date: '2024-01-20',
      description: 'Resultados del inventario de ansiedad de Beck',
      file_url: 'https://example.com/docs/beck.pdf',
      patient_id: this.patient?.id || 1,
    },
    {
      id: 4,
      name: 'Radiografia_Torax.jpg',
      type: 'jpg',
      size: '2.1 MB',
      upload_date: '2024-01-12',
      description: 'Radiografía de tórax solicitada por médico tratante',
      file_url: 'https://example.com/docs/xray.jpg',
      patient_id: this.patient?.id || 1,
    },
  ];

  readonly displayDocuments = computed(() => {
    // Si no hay documentos de la API, mostrar los mockeados
    return this.documents.length > 0 ? this.documents : this.mockDocuments;
  });

  getFileIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'text-red-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getFileIconSvg(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf':
        return `<path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 13H8" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 17H8" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 9H8" />`;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21"/>`;
      default:
        return `<path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6" />`;
    }
  }

  handleViewDocument(document: Document): void {
    this.viewingDocument.set(document);
  }

  closeDocumentView(): void {
    this.viewingDocument.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      // Mostrar información de los archivos seleccionados
      const fileNames = Array.from(files).map(
        (file) => `${file.name} (${this.formatFileSize(file.size)})`
      );
      alert(
        `Archivos seleccionados:\n${fileNames.join(
          '\n'
        )}\n\nEn una aplicación real, estos archivos se subirían al servidor.`
      );

      // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
      input.value = '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  handleDownloadDocument(document: Document): void {
    // TODO: Implementar descarga de documentos
  }

  handleDeleteDocument(document: Document): void {
    // TODO: Implementar eliminación de documentos
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES');
  }
}
