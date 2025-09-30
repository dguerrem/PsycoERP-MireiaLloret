import {
  Component,
  ChangeDetectionStrategy,
  Input,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Patient } from '../../../shared/models/patient.model';
import { PatientDocument } from '../../../shared/models/patient-detail.model';

@Component({
  selector: 'app-patient-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-documentation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDocumentationComponent {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) patient!: Patient;
  @Input() documents: PatientDocument[] = [];

  readonly viewingDocument = signal<PatientDocument | null>(null);

  getFileIcon(type: string): string {
    const normalizedType = this.normalizeFileType(type);
    switch (normalizedType) {
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

  getFileIconSvg(type: string): SafeHtml {
    const normalizedType = this.normalizeFileType(type);
    let svgContent = '';

    switch (normalizedType) {
      case 'pdf':
        svgContent = `<path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 13H8" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 17H8" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 9H8" />`;
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
        svgContent = `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21"/>`;
        break;
      default:
        svgContent = `<path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6" />`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  private normalizeFileType(type: string): string {
    // Handle MIME types (e.g., "application/pdf" -> "pdf")
    if (type.includes('/')) {
      return type.split('/').pop()?.toLowerCase() || type.toLowerCase();
    }
    return type.toLowerCase();
  }

  handleViewDocument(document: PatientDocument): void {
    this.viewingDocument.set(document);
  }

  closeDocumentView(): void {
    this.viewingDocument.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      console.log('Archivos seleccionados:', files);

      // Mostrar información de los archivos seleccionados
      const fileNames = Array.from(files).map(file => `${file.name} (${this.formatFileSize(file.size)})`);
      alert(`Archivos seleccionados:\n${fileNames.join('\n')}\n\nEn una aplicación real, estos archivos se subirían al servidor.`);

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

  handleDownloadDocument(document: PatientDocument): void {
    // TODO: Implementar descarga de documentos
    console.log('Descargando documento:', document.name);
  }

  handleDeleteDocument(document: PatientDocument): void {
    // TODO: Implementar eliminación de documentos
    console.log('Eliminando documento:', document.name);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES');
  }
}