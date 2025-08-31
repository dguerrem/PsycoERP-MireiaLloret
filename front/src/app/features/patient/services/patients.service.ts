import { Injectable, signal, computed } from '@angular/core';
import { Patient } from '../../../shared/models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private patients = signal<Patient[]>([]);
  private selectedPatient = signal<Patient | null>(null);
  private searchTerm = signal('');
  private statusFilter = signal<string>('all');

  // Computed properties
  readonly allPatients = this.patients.asReadonly();
  readonly currentPatient = this.selectedPatient.asReadonly();
  readonly currentSearchTerm = this.searchTerm.asReadonly();
  readonly currentStatusFilter = this.statusFilter.asReadonly();

  readonly filteredPatients = computed(() => {
    const patients = this.patients();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(search) ||
        patient.dni.toLowerCase().includes(search) ||
        patient.email.toLowerCase().includes(search);
      
      const matchesStatus = status === 'all' || patient.status === status;
      
      return matchesSearch && matchesStatus;
    });
  });

  // Mock data initialization
  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize with mock data
   */
  private initializeMockData(): void {
    const mockPatients: Patient[] = [
      {
        id: 1,
        name: "Ana García",
        email: "ana.garcia@email.com",
        phone: "+34 600 123 456",
        dni: "12345678A",
        status: "active",
        session_type: "individual",
        address: "Calle Mayor 123, 28001 Madrid",
        birth_date: "1985-03-15",
        emergency_contact_name: "María García",
        emergency_contact_phone: "+34 600 123 457",
        medical_history: "Historial de ansiedad leve. Sin otras patologías relevantes.",
        current_medication: "Ninguna",
        allergies: "Penicilina",
        referred_by: "Médico de cabecera - Dr. Martínez",
        insurance_provider: "Sanitas",
        insurance_number: "SAN001234567",
        notes: "Paciente muy colaborativo, puntual en las citas.",
        created_at: "2024-01-15",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 2,
        name: "Carlos López",
        email: "carlos.lopez@email.com",
        phone: "+34 600 234 567",
        dni: "23456789B",
        status: "active",
        session_type: "couples",
        address: "Avenida de América 456, 28002 Madrid",
        birth_date: "1978-07-22",
        emergency_contact_name: "Isabel López",
        emergency_contact_phone: "+34 600 234 568",
        medical_history: "Sin antecedentes médicos relevantes.",
        current_medication: "Ninguna",
        allergies: "Ninguna conocida",
        referred_by: "Derivado por psicólogo anterior",
        insurance_provider: "Adeslas",
        insurance_number: "ADE987654321",
        notes: "Terapia de pareja, muy motivado.",
        created_at: "2024-02-01",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 3,
        name: "María Rodríguez",
        email: "maria.rodriguez@email.com",
        phone: "+34 600 345 678",
        dni: "34567890C",
        status: "active",
        session_type: "individual",
        address: "Calle de Alcalá 789, 28009 Madrid",
        birth_date: "1990-11-08",
        emergency_contact_name: "Pedro Rodríguez",
        emergency_contact_phone: "+34 600 345 679",
        medical_history: "Episodio depresivo previo en 2020.",
        current_medication: "Sertralina 50mg",
        allergies: "Alergia al polen",
        referred_by: "Médico de familia - Dra. López",
        insurance_provider: "Mapfre",
        insurance_number: "MAP555666777",
        notes: "Progreso muy positivo en las últimas sesiones.",
        created_at: "2024-01-20",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 4,
        name: "David Martín",
        email: "david.martin@email.com",
        phone: "+34 600 456 789",
        dni: "45678901D",
        status: "inactive",
        session_type: "group",
        address: "Plaza España 321, 28008 Madrid",
        birth_date: "1982-04-12",
        emergency_contact_name: "Ana Martín",
        emergency_contact_phone: "+34 600 456 790",
        medical_history: "Trastorno de ansiedad social.",
        current_medication: "Ninguna",
        allergies: "Lactosa",
        referred_by: "Centro de salud mental",
        insurance_provider: "DKV",
        insurance_number: "DKV123789456",
        notes: "Suspendido temporalmente por motivos laborales.",
        created_at: "2024-03-01",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 5,
        name: "Laura Sánchez",
        email: "laura.sanchez@email.com",
        phone: "+34 600 567 890",
        dni: "56789012E",
        status: "active",
        session_type: "family",
        address: "Calle Serrano 654, 28001 Madrid",
        birth_date: "1975-09-25",
        emergency_contact_name: "Roberto Sánchez",
        emergency_contact_phone: "+34 600 567 891",
        medical_history: "Sin antecedentes relevantes.",
        current_medication: "Ninguna",
        allergies: "Ninguna conocida",
        referred_by: "Recomendación familiar",
        insurance_provider: "Sanitas",
        insurance_number: "SAN998877665",
        notes: "Terapia familiar con adolescentes.",
        created_at: "2024-02-15",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 6,
        name: "Pedro Jiménez",
        email: "pedro.jimenez@email.com",
        phone: "+34 600 678 901",
        dni: "67890123F",
        status: "active",
        session_type: "individual",
        address: "Gran Vía 987, 28013 Madrid",
        birth_date: "1988-12-03",
        emergency_contact_name: "Carmen Jiménez",
        emergency_contact_phone: "+34 600 678 902",
        medical_history: "Trastorno del sueño, estrés laboral.",
        current_medication: "Melatonina",
        allergies: "Aspirina",
        referred_by: "Médico del trabajo",
        insurance_provider: "Adeslas",
        insurance_number: "ADE456123789",
        notes: "Muy buena evolución, sesiones quincenales.",
        created_at: "2024-01-10",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 7,
        name: "Carmen Ruiz",
        email: "carmen.ruiz@email.com",
        phone: "+34 600 789 012",
        dni: "78901234G",
        status: "discharged",
        session_type: "individual",
        address: "Paseo de la Castellana 147, 28046 Madrid",
        birth_date: "1993-06-18",
        emergency_contact_name: "Miguel Ruiz",
        emergency_contact_phone: "+34 600 789 013",
        medical_history: "Fobia específica a volar.",
        current_medication: "Ninguna",
        allergies: "Ninguna conocida",
        referred_by: "Internet",
        insurance_provider: "Mapfre",
        insurance_number: "MAP789456123",
        notes: "Alta terapéutica conseguida. Muy satisfactoria.",
        created_at: "2023-12-01",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 8,
        name: "Miguel Torres",
        email: "miguel.torres@email.com",
        phone: "+34 600 890 123",
        dni: "89012345H",
        status: "active",
        session_type: "couples",
        address: "Calle Goya 258, 28001 Madrid",
        birth_date: "1986-01-30",
        emergency_contact_name: "Patricia Torres",
        emergency_contact_phone: "+34 600 890 124",
        medical_history: "Sin antecedentes médicos.",
        current_medication: "Ninguna",
        allergies: "Mariscos",
        referred_by: "Recomendación de amigos",
        insurance_provider: "DKV",
        insurance_number: "DKV987654321",
        notes: "Terapia de pareja, buena implicación de ambos.",
        created_at: "2024-02-20",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 9,
        name: "Isabel Moreno",
        email: "isabel.moreno@email.com",
        phone: "+34 600 901 234",
        dni: "90123456I",
        status: "on-hold",
        session_type: "individual",
        address: "Calle Velázquez 369, 28001 Madrid",
        birth_date: "1991-05-14",
        emergency_contact_name: "Francisco Moreno",
        emergency_contact_phone: "+34 600 901 235",
        medical_history: "Trastorno adaptativo.",
        current_medication: "Lorazepam ocasional",
        allergies: "Polen",
        referred_by: "Médico de cabecera",
        insurance_provider: "Sanitas",
        insurance_number: "SAN111222333",
        notes: "Pausa por cambio de ciudad temporal.",
        created_at: "2024-03-05",
        updated_at: "2025-08-25T19:17:42.000Z"
      },
      {
        id: 10,
        name: "Javier Herrera",
        email: "javier.herrera@email.com",
        phone: "+34 600 012 345",
        dni: "01234567J",
        status: "active",
        session_type: "group",
        address: "Calle Príncipe de Vergara 741, 28006 Madrid",
        birth_date: "1984-10-27",
        emergency_contact_name: "Lucía Herrera",
        emergency_contact_phone: "+34 600 012 346",
        medical_history: "Trastorno de la personalidad por evitación.",
        current_medication: "Ninguna",
        allergies: "Ninguna conocida",
        referred_by: "Centro de salud mental",
        insurance_provider: "Adeslas",
        insurance_number: "ADE321654987",
        notes: "Terapia de grupo, muy participativo.",
        created_at: "2024-01-25",
        updated_at: "2025-08-25T19:17:42.000Z"
      }
    ];

    this.patients.set(mockPatients);
  }

  /**
   * Get all patients
   */
  getPatients(): Patient[] {
    return this.patients();
  }

  /**
   * Get patient by ID
   */
  getPatientById(id: number): Patient | undefined {
    return this.patients().find(patient => patient.id === id);
  }

  /**
   * Select a patient
   */
  selectPatient(patient: Patient | null): void {
    this.selectedPatient.set(patient);
  }

  /**
   * Update patient
   */
  updatePatient(updatedPatient: Patient): void {
    const patients = this.patients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      const newPatients = [...patients];
      newPatients[index] = updatedPatient;
      this.patients.set(newPatients);
    }
  }

  /**
   * Add new patient
   */
  addPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): void {
    const patients = this.patients();
    const newId = Math.max(...patients.map(p => p.id), 0) + 1;
    const now = new Date().toISOString();
    
    const newPatient: Patient = {
      ...patient,
      id: newId,
      created_at: now.split('T')[0],
      updated_at: now
    };

    this.patients.set([...patients, newPatient]);
  }

  /**
   * Delete patient
   */
  deletePatient(id: number): void {
    const patients = this.patients();
    this.patients.set(patients.filter(p => p.id !== id));
  }

  /**
   * Set search term
   */
  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Set status filter
   */
  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
  }

  /**
   * Get status color for badges
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'discharged':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status label in Spanish
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'discharged':
        return 'Alta';
      case 'on-hold':
        return 'En Pausa';
      default:
        return status;
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Capitalize session type
   */
  capitalizeSessionType(sessionType: string): string {
    const typeMap: { [key: string]: string } = {
      'individual': 'individual',
      'couples': 'couples',
      'family': 'family',
      'group': 'group'
    };
    return typeMap[sessionType] || sessionType;
  }
}