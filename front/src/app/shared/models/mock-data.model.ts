// Simplified interfaces for patient summary component
export interface Session {
  id: string;
  patientId: number;
  professionalName: string;
  type: string;
  date: Date;
  price: number;
  paymentMethod: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

export interface Invoice {
  id: string;
  patientId: number;
  patientName: string;
  patientDni: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Bonus {
  id: string;
  patientId: number;
  patientName: string;
  type: string;
  amount: number;
  remaining: number;
  expiryDate: Date;
  status: 'active' | 'expired' | 'used';
}

// Mock data generation functions
export class MockDataUtils {
  static generateMockSessions(patientId: number): Session[] {
    const sessions: Session[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 15; i++) {
      const sessionDate = new Date(currentDate);
      sessionDate.setDate(currentDate.getDate() - (i * 7)); // Weekly sessions going back

      sessions.push({
        id: `SESSION-${1000 + i}`,
        patientId,
        professionalName: 'Dr. García López',
        type: 'Terapia Individual',
        date: sessionDate,
        price: 60,
        paymentMethod: ['cash', 'card', 'transfer'][Math.floor(Math.random() * 3)],
        status: i < 10 ? 'completed' : (i < 12 ? 'scheduled' : 'cancelled')
      });
    }

    return sessions;
  }

  static generateMockInvoices(patientId: number, patientName: string, patientDni: string): Invoice[] {
    const invoices: Invoice[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 5; i++) {
      const invoiceDate = new Date(currentDate);
      invoiceDate.setMonth(currentDate.getMonth() - i);

      invoices.push({
        id: `INV-${2000 + i}`,
        patientId,
        patientName,
        patientDni,
        amount: 240, // 4 sessions * 60€
        date: invoiceDate,
        status: i < 3 ? 'paid' : 'pending'
      });
    }

    return invoices;
  }

  static generateMockBonuses(patientId: number, patientName: string): Bonus[] {
    const bonuses: Bonus[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(currentDate.getMonth() + 3);

      bonuses.push({
        id: `BONUS-${3000 + i}`,
        patientId,
        patientName,
        type: 'Bono 4 Sesiones',
        amount: 240,
        remaining: i === 0 ? 2 : 0,
        expiryDate,
        status: i === 0 ? 'active' : 'used'
      });
    }

    return bonuses;
  }
}