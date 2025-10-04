import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  /**
   * Genera y descarga un PDF a partir de un elemento HTML
   * @param element Elemento HTML a convertir en PDF
   * @param fileName Nombre del archivo PDF a descargar
   */
  async generatePdfFromElement(element: HTMLElement, fileName: string): Promise<void> {
    try {
      // Convertir el HTML a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Mayor calidad
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Obtener dimensiones para A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Agregar la imagen al PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Descargar el PDF
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  }

  /**
   * Genera y descarga un PDF a partir de un ID de elemento
   * @param elementId ID del elemento HTML
   * @param fileName Nombre del archivo PDF a descargar
   */
  async generatePdfById(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`No se encontró el elemento con ID: ${elementId}`);
    }

    await this.generatePdfFromElement(element, fileName);
  }
}
