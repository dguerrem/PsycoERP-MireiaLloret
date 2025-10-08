import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from './services/billing.service';
import {
  InvoiceKPIs,
  PendingInvoice,
  ExistingInvoice,
} from './models/billing.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ReusableModalComponent } from '../../shared/components/reusable-modal/reusable-modal.component';
import {
  InvoicePreviewComponent,
  InvoicePreviewData,
} from './components/invoice-preview.component';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { InvoiceTemplateComponent } from './components/invoice-template.component';
import { ToastService } from '../../core/services/toast.service';

interface InvoiceToGenerate extends InvoicePreviewData {}

/**
 * Componente de facturación
 * Gestiona generación masiva de facturas y visualización de KPIs
 */
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SectionHeaderComponent,
    ReusableModalComponent,
    InvoicePreviewComponent,
    SpinnerComponent,
    InvoiceTemplateComponent,
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingComponent implements OnInit {
  private billingService = inject(BillingService);
  private userService = inject(UserService);
  private pdfGenerator = inject(PdfGeneratorService);
  private toastService = inject(ToastService);

  // Signals para estado del componente
  activeTab = signal<'bulk' | 'existing'>('bulk');

  // Filtros para KPIs (Período de Análisis)
  kpiMonth = signal(new Date().getMonth() + 1);
  kpiYear = signal(new Date().getFullYear());

  // Filtros para Facturas Pendientes
  pendingMonth = signal(new Date().getMonth() + 1);
  pendingYear = signal(new Date().getFullYear());

  // Filtros para Facturas Existentes
  existingMonth = signal(new Date().getMonth() + 1);
  existingYear = signal(new Date().getFullYear());

  kpis = signal<InvoiceKPIs | null>(null);
  pendingInvoices = signal<PendingInvoice[]>([]);
  existingInvoices = signal<ExistingInvoice[]>([]);
  selectedPatients = signal<string[]>([]);

  // Numeración de facturas
  invoicePrefix = signal('FAC');
  invoiceYear = signal(new Date().getFullYear());
  invoiceNextNumber = signal(1);

  // Modal state
  isModalOpen = signal(false);
  invoicesToGenerate = signal<InvoiceToGenerate[]>([]);

  // Preview modal state
  isPreviewModalOpen = signal(false);
  previewInvoiceData = signal<InvoiceToGenerate | null>(null);

  // User data for invoice
  userData = signal<User | null>(null);

  isLoadingKPIs = signal(false);
  isLoadingPending = signal(false);
  isLoadingExisting = signal(false);

  // PDF Generation state
  isGeneratingPDFs = signal(false);
  currentPDFProgress = signal({ current: 0, total: 0 });
  hiddenInvoiceData = signal<InvoiceToGenerate | null>(null);

  // Error state
  errorMessage = signal<string | null>(null);

  // Bulk invoice generation state
  isGeneratingBulkInvoices = signal(false);

  // Computed signals
  monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  years = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // 5 años hacia atrás, año actual, y 5 años hacia adelante
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  });

  allSelected = computed(
    () =>
      this.pendingInvoices().length > 0 &&
      this.selectedPatients().length === this.pendingInvoices().length
  );

  selectedCount = computed(() => this.selectedPatients().length);

  totalSelectedAmount = computed(() => {
    const selected = this.selectedPatients();
    return this.pendingInvoices()
      .filter((inv) => selected.includes(inv.dni))
      .reduce((sum, inv) => sum + inv.total_gross, 0);
  });

  ngOnInit() {
    this.loadKPIs();
    this.loadPendingInvoices();
    this.loadUserData();
    this.loadLastInvoiceNumber();
  }

  /**
   * Carga los datos del usuario
   */
  loadUserData() {
    // Obtener el ID del usuario (asumiendo que es 1, o podrías obtenerlo del servicio de auth)
    this.userService.getUserProfile(1).subscribe({
      next: (user) => {
        this.userData.set(user);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  /**
   * Carga los KPIs de facturación
   */
  loadKPIs() {
    this.isLoadingKPIs.set(true);
    this.billingService.getKPIs(this.kpiMonth(), this.kpiYear()).subscribe({
      next: (response) => {
        this.kpis.set(response.data);
        this.isLoadingKPIs.set(false);
      },
      error: () => {
        this.isLoadingKPIs.set(false);
      },
    });
  }

  /**
   * Carga las facturas pendientes
   */
  loadPendingInvoices() {
    this.isLoadingPending.set(true);
    this.billingService
      .getPendingInvoices(this.pendingMonth(), this.pendingYear())
      .subscribe({
        next: (response) => {
          this.pendingInvoices.set(response.data.pending_invoices);
          this.isLoadingPending.set(false);
          // Limpiar selección al cambiar filtros
          this.selectedPatients.set([]);
        },
        error: () => {
          this.isLoadingPending.set(false);
        },
      });
  }

  /**
   * Carga las facturas existentes
   */
  loadExistingInvoices() {
    this.isLoadingExisting.set(true);
    this.billingService
      .getExistingInvoices(this.existingMonth(), this.existingYear())
      .subscribe({
        next: (response) => {
          this.existingInvoices.set(response.data.invoices);
          this.isLoadingExisting.set(false);
        },
        error: () => {
          this.isLoadingExisting.set(false);
        },
      });
  }

  /**
   * Maneja el cambio de mes en el filtro de KPIs
   */
  onKpiMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.kpiMonth.set(parseInt(select.value));
    this.loadKPIs();
  }

  /**
   * Maneja el cambio de año en el filtro de KPIs
   */
  onKpiYearChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.kpiYear.set(parseInt(select.value));
    this.loadKPIs();
  }

  /**
   * Maneja el cambio de mes en el filtro de Facturas Pendientes
   */
  onPendingMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pendingMonth.set(parseInt(select.value));
    this.loadPendingInvoices();
  }

  /**
   * Maneja el cambio de año en el filtro de Facturas Pendientes
   */
  onPendingYearChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pendingYear.set(parseInt(select.value));
    this.loadPendingInvoices();
  }

  /**
   * Maneja el cambio de mes en el filtro de Facturas Existentes
   */
  onExistingMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.existingMonth.set(parseInt(select.value));
    this.loadExistingInvoices();
  }

  /**
   * Maneja el cambio de año en el filtro de Facturas Existentes
   */
  onExistingYearChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.existingYear.set(parseInt(select.value));
    this.loadExistingInvoices();
  }

  /**
   * Valida el año cuando el usuario sale del campo (blur)
   */
  validateInvoiceYear() {
    const year = this.invoiceYear();
    if (year < 2000) {
      this.invoiceYear.set(2000);
      this.loadLastInvoiceNumber();
    }
  }

  /**
   * Maneja el cambio de año en el campo de numeración de facturas
   */
  onInvoiceYearChange() {
    const year = this.invoiceYear();
    // Solo cargar si el año es válido
    if (year >= 2000) {
      this.loadLastInvoiceNumber();
    }
  }

  /**
   * Carga el último número de factura para el año seleccionado
   */
  loadLastInvoiceNumber() {
    this.billingService.getLastInvoiceNumber(this.invoiceYear()).subscribe({
      next: (response: any) => {
        // Manejar diferentes estructuras de respuesta
        let lastNumber = 0;

        if (response.data) {
          // Si la respuesta viene envuelta en un objeto data
          lastNumber = response.data.last_invoice_number || 0;
        } else if (response.last_invoice_number !== undefined) {
          // Si la respuesta viene directamente
          lastNumber = response.last_invoice_number;
        }

        // El próximo número es el último + 1
        const nextNumber = lastNumber + 1;
        this.invoiceNextNumber.set(nextNumber);
      },
      error: (error) => {
        console.error('Error loading last invoice number:', error);
        // En caso de error, usar 1 como valor por defecto
        this.invoiceNextNumber.set(1);
      },
    });
  }

  /**
   * Cambia entre tabs
   */
  onTabChange(tab: 'bulk' | 'existing') {
    this.activeTab.set(tab);
    if (tab === 'existing' && this.existingInvoices().length === 0) {
      this.loadExistingInvoices();
    }
  }

  /**
   * Alterna la selección de un paciente
   */
  togglePatientSelection(dni: string) {
    const current = this.selectedPatients();
    if (current.includes(dni)) {
      this.selectedPatients.set(current.filter((d) => d !== dni));
    } else {
      this.selectedPatients.set([...current, dni]);
    }
  }

  /**
   * Selecciona o deselecciona todos los pacientes
   */
  selectAllPatients() {
    if (this.allSelected()) {
      this.selectedPatients.set([]);
    } else {
      this.selectedPatients.set(this.pendingInvoices().map((inv) => inv.dni));
    }
  }

  /**
   * Abre el modal con las facturas a generar
   */
  generateBulkInvoices() {
    const selected = this.selectedPatients();
    if (selected.length === 0) {
      return;
    }

    // Obtener datos de las facturas seleccionadas
    const selectedInvoices = this.pendingInvoices().filter((inv) =>
      selected.includes(inv.dni)
    );

    // Preparar datos para el modal
    const invoices: InvoiceToGenerate[] = selectedInvoices.map(
      (inv, index) => ({
        patient_full_name: inv.patient_full_name,
        dni: inv.dni,
        email: inv.email,
        pending_sessions_count: inv.pending_sessions_count,
        total_gross: inv.total_gross,
        invoice_number: `${this.invoicePrefix()}-${this.invoiceYear()}-${this.padNumber(
          this.invoiceNextNumber() + index
        )}`,
        invoice_date: new Date().toISOString().split('T')[0],
        sessions: inv.sessions,
      })
    );

    this.invoicesToGenerate.set(invoices);
    this.isModalOpen.set(true);
  }

  /**
   * Cierra el modal de generación
   */
  closeModal() {
    this.isModalOpen.set(false);
    this.invoicesToGenerate.set([]);
    this.errorMessage.set(null);
  }

  /**
   * Cierra el mensaje de error
   */
  closeErrorMessage() {
    this.errorMessage.set(null);
  }

  /**
   * Confirma y genera las facturas desde el modal
   */
  confirmGenerateInvoices() {
    const invoicesToCreate = this.invoicesToGenerate();

    if (invoicesToCreate.length === 0) {
      return;
    }

    // Activar spinner
    this.isGeneratingBulkInvoices.set(true);

    // Obtener datos completos de las facturas seleccionadas
    const selected = this.selectedPatients();
    const selectedInvoicesData = this.pendingInvoices().filter((inv) =>
      selected.includes(inv.dni)
    );

    // Preparar el payload para el backend
    const invoicesPayload = invoicesToCreate.map((invoice, index) => {
      const originalData = selectedInvoicesData[index];
      const monthName = this.monthNames[this.pendingMonth() - 1];

      return {
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        patient_id: originalData.patient_id,
        session_ids: originalData.sessions.map(s => s.session_id),
        concept: `Sesiones ${
          originalData.patient_full_name
        } - ${monthName} ${this.pendingYear()}`,
      };
    });

    // Llamar al servicio para crear las facturas
    this.billingService.createBulkInvoices(invoicesPayload).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa:', response);

        // La respuesta puede venir en response.data o directamente en response
        const data = response?.data || response;

        // Verificar si la operación fue exitosa
        if (response?.success === false && data?.failed && data.failed.length > 0) {
          // Buscar error de número de factura duplicado
          const duplicateError = data.failed.find(
            (f: any) =>
              f.error?.includes('número de factura ya existe') ||
              f.error?.includes('already exists')
          );

          if (duplicateError) {
            this.errorMessage.set(
              'No se pudieron generar las facturas. Uno o más números de factura ya existen en el sistema. Por favor, verifica la numeración e intenta nuevamente.'
            );
          } else {
            this.errorMessage.set(
              'Ocurrió un error al generar las facturas. Por favor, revisa los datos e intenta nuevamente.'
            );
          }
          this.isGeneratingBulkInvoices.set(false);
        } else {
          // Todas las facturas se crearon exitosamente
          const successCount = data?.successful?.length || invoicesToCreate.length;
          this.toastService.showSuccess(
            `Se ${successCount === 1 ? 'generó' : 'generaron'} ${successCount} ${successCount === 1 ? 'factura' : 'facturas'} exitosamente`
          );
          this.closeModal();
          this.errorMessage.set(null);
          this.isGeneratingBulkInvoices.set(false);
          // Recargar datos después de generar
          this.loadKPIs();
          this.loadPendingInvoices();
          this.loadExistingInvoices();
        }
      },
      error: () => {
        this.isGeneratingBulkInvoices.set(false);
        this.errorMessage.set(
          'Ocurrió un error al generar las facturas. Por favor, intenta nuevamente.'
        );
      },
    });
  }

  /**
   * Actualiza el número de factura de un paciente
   */
  updateInvoiceNumber(dni: string, newNumber: string) {
    const invoices = this.invoicesToGenerate();
    const index = invoices.findIndex((inv) => inv.dni === dni);
    if (index !== -1) {
      const updated = [...invoices];
      updated[index] = { ...updated[index], invoice_number: newNumber };
      this.invoicesToGenerate.set(updated);
    }
  }

  /**
   * Actualiza la fecha de emisión de un paciente
   */
  updateInvoiceDate(dni: string, newDate: string) {
    const invoices = this.invoicesToGenerate();
    const index = invoices.findIndex((inv) => inv.dni === dni);
    if (index !== -1) {
      const updated = [...invoices];
      updated[index] = { ...updated[index], invoice_date: newDate };
      this.invoicesToGenerate.set(updated);
    }
  }

  /**
   * Vista previa de la factura
   */
  previewInvoice(dni: string) {
    const invoice = this.invoicesToGenerate().find((inv) => inv.dni === dni);
    if (invoice) {
      this.previewInvoiceData.set(invoice);
      this.isPreviewModalOpen.set(true);
    }
  }

  /**
   * Vista previa de una factura existente
   */
  previewExistingInvoice(invoice: ExistingInvoice) {
    // Convertir ExistingInvoice a InvoicePreviewData
    const previewData: InvoicePreviewData = {
      patient_full_name: invoice.patient_full_name,
      dni: invoice.dni,
      email: '', // No disponible en ExistingInvoice
      pending_sessions_count: invoice.sessions_count,
      total_gross: invoice.total,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      sessions: invoice.sessions
    };

    this.previewInvoiceData.set(previewData);
    this.isPreviewModalOpen.set(true);
  }

  /**
   * Cierra el modal de vista previa
   */
  closePreviewModal() {
    this.isPreviewModalOpen.set(false);
    this.previewInvoiceData.set(null);
  }

  /**
   * Imprime la factura
   */
  printInvoice() {
    window.print();
  }

  /**
   * Descarga el PDF de la factura
   */
  downloadInvoicePDF() {
    const invoice = this.previewInvoiceData();
    if (invoice) {
      // TODO: Implementar descarga real del PDF
      console.log('Descargando PDF:', invoice.invoice_number);
    }
  }

  /**
   * Formatea un número como moneda
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  /**
   * Obtiene el nombre del mes de KPIs
   */
  getKpiMonthName(): string {
    return this.monthNames[this.kpiMonth() - 1];
  }

  /**
   * Obtiene el nombre del mes de facturas pendientes
   */
  getPendingMonthName(): string {
    return this.monthNames[this.pendingMonth() - 1];
  }

  /**
   * Obtiene el nombre del mes de facturas existentes
   */
  getExistingMonthName(): string {
    return this.monthNames[this.existingMonth() - 1];
  }

  /**
   * Formatea número con padding
   */
  padNumber(num: number, length: number = 4): string {
    return num.toString().padStart(length, '0');
  }

  /**
   * Genera PDFs para todas las facturas seleccionadas
   */
  async generateAllPDFs() {
    const selected = this.selectedPatients();
    if (selected.length === 0) {
      return;
    }

    // Obtener datos de las facturas seleccionadas
    const selectedInvoices = this.pendingInvoices().filter((inv) =>
      selected.includes(inv.dni)
    );

    // Preparar datos para las facturas
    const invoices: InvoiceToGenerate[] = selectedInvoices.map(
      (inv, index) => ({
        patient_full_name: inv.patient_full_name,
        dni: inv.dni,
        email: inv.email,
        pending_sessions_count: inv.pending_sessions_count,
        total_gross: inv.total_gross,
        invoice_number: `${this.invoicePrefix()}-${this.invoiceYear()}-${this.padNumber(
          this.invoiceNextNumber() + index
        )}`,
        invoice_date: new Date().toISOString().split('T')[0],
        sessions: inv.sessions,
      })
    );

    // Mostrar spinner
    this.isGeneratingPDFs.set(true);
    this.currentPDFProgress.set({ current: 0, total: invoices.length });

    // Generar PDFs uno por uno usando el contenedor oculto
    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i];

      // Actualizar progreso
      this.currentPDFProgress.set({ current: i + 1, total: invoices.length });

      // Establecer datos en el contenedor oculto
      this.hiddenInvoiceData.set(invoice);

      // Esperar a que el DOM se actualice
      await new Promise((resolve) => setTimeout(resolve, 150));

      try {
        // Crear nombre de archivo descriptivo: "FACTURA-FAC-2025-0020-Juan_Perez"
        const patientName = invoice.patient_full_name
          .replace(/\s+/g, '_')  // Reemplazar espacios por guiones bajos
          .normalize('NFD')       // Normalizar caracteres acentuados
          .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos

        const fileName = `FACTURA-${invoice.invoice_number}-${patientName}`;

        await this.pdfGenerator.generatePdfById(
          'hidden-invoice-content',
          fileName
        );
      } catch (error) {
        console.error(
          `Error generando PDF para ${invoice.invoice_number}:`,
          error
        );
      }

      // Pequeña pausa entre PDFs
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Limpiar estado
    this.hiddenInvoiceData.set(null);
    this.isGeneratingPDFs.set(false);
    this.currentPDFProgress.set({ current: 0, total: 0 });
  }
}
