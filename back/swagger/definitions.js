const definitions = {
  Session: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único de la sesión",
        example: 1,
      },
      patient_id: {
        type: "integer",
        format: "int64",
        description: "ID del paciente",
        example: 1,
      },
      clinic_id: {
        type: "integer",
        format: "int64",
        description: "ID de la clínica",
        example: 1,
      },
      session_date: {
        type: "string",
        format: "date",
        description: "Fecha de la sesión (YYYY-MM-DD)",
        example: "2024-12-15",
      },
      start_time: {
        type: "string",
        format: "time",
        description: "Hora de inicio (HH:MM:SS)",
        example: "09:00:00",
      },
      end_time: {
        type: "string",
        format: "time",
        description: "Hora de finalización (HH:MM:SS)",
        example: "10:00:00",
      },
      mode: {
        type: "string",
        description: "Modalidad de la sesión",
        example: "Presencial",
      },
      type: {
        type: "string",
        description: "Tipo de terapia",
        example: "Terapia Individual",
      },
      status: {
        type: "string",
        enum: ["scheduled", "completed", "cancelled", "no-show"],
        description: "Estado de la sesión",
        example: "scheduled",
      },
      price: {
        type: "number",
        format: "decimal",
        description: "Precio de la sesión",
        example: 60.0,
      },
      payment_method: {
        type: "string",
        enum: ["cash", "card", "transfer", "insurance"],
        description: "Método de pago",
        example: "card",
      },
      payment_status: {
        type: "string",
        enum: ["pending", "paid", "partially_paid"],
        description: "Estado del pago",
        example: "pending",
      },
      notes: {
        type: "string",
        description: "Notas adicionales",
        example: "Primera sesión del paciente",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "Fecha de creación",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "Fecha de última actualización",
      },
    },
  },

  SessionsResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      total: {
        type: "integer",
        example: 3,
      },
      filters_applied: {
        type: "object",
        nullable: true,
        example: {
          patient_id: "1",
          status: "completed",
        },
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Session",
        },
      },
    },
  },

  Patient: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único del paciente",
        example: 1,
      },
      name: {
        type: "string",
        description: "Nombre completo del paciente",
        example: "Juan Pérez García",
      },
      email: {
        type: "string",
        format: "email",
        description: "Email del paciente",
        example: "juan.perez@email.com",
      },
      phone: {
        type: "string",
        description: "Teléfono del paciente",
        example: "+34 666 123 456",
      },
      dni: {
        type: "string",
        description: "DNI del paciente",
        example: "12345678A",
      },
      status: {
        type: "string",
        enum: ["active", "inactive", "discharged", "on-hold"],
        description: "Estado del paciente",
        example: "active",
      },
      session_type: {
        type: "string",
        enum: ["individual", "group", "family", "couples"],
        description: "Tipo de sesión preferida",
        example: "individual",
      },
      address: {
        type: "string",
        nullable: true,
        description: "Dirección del paciente",
        example: "Calle Mayor 123, Valencia",
      },
      birth_date: {
        type: "string",
        format: "date",
        nullable: true,
        description: "Fecha de nacimiento",
        example: "1985-03-15",
      },
      emergency_contact_name: {
        type: "string",
        nullable: true,
        description: "Nombre del contacto de emergencia",
        example: "María Pérez",
      },
      emergency_contact_phone: {
        type: "string",
        nullable: true,
        description: "Teléfono del contacto de emergencia",
        example: "+34 666 987 654",
      },
      medical_history: {
        type: "string",
        nullable: true,
        description: "Historial médico",
        example: "Antecedentes de ansiedad",
      },
      current_medication: {
        type: "string",
        nullable: true,
        description: "Medicación actual",
        example: "Sertralina 50mg",
      },
      allergies: {
        type: "string",
        nullable: true,
        description: "Alergias conocidas",
        example: "Penicilina",
      },
      referred_by: {
        type: "string",
        nullable: true,
        description: "Referido por",
        example: "Dr. Smith",
      },
      insurance_provider: {
        type: "string",
        nullable: true,
        description: "Proveedor de seguros",
        example: "Sanitas",
      },
      insurance_number: {
        type: "string",
        nullable: true,
        description: "Número de póliza",
        example: "POL123456789",
      },
      notes: {
        type: "string",
        nullable: true,
        description: "Notas adicionales",
        example: "Paciente muy colaborativo",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "Fecha de creación",
        example: "2024-01-15T10:30:00Z",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "Fecha de última actualización",
        example: "2024-01-20T14:45:00Z",
      },
    },
  },

  PatientsResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      total: {
        type: "integer",
        example: 5,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Patient",
        },
      },
    },
  },

  PatientResumeSession: {
    type: "object",
    properties: {
      idsesion: {
        type: "integer",
        format: "int64",
        description: "ID único de la sesión",
        example: 1,
      },
      tipo_sesion: {
        type: "string",
        description: "Tipo de sesión",
        example: "Terapia Individual",
      },
      fecha: {
        type: "string",
        format: "date",
        description: "Fecha de la sesión (YYYY-MM-DD)",
        example: "2024-12-15",
      },
      precio: {
        type: "number",
        format: "decimal",
        description: "Precio de la sesión",
        example: 60.0,
      },
      metodo_pago: {
        type: "string",
        enum: ["cash", "card", "transfer", "insurance"],
        description: "Método de pago",
        example: "card",
      },
    },
  },

  PatientResume: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único del paciente",
        example: 1,
      },
      email: {
        type: "string",
        format: "email",
        description: "Email del paciente",
        example: "juan.perez@email.com",
      },
      phone: {
        type: "string",
        description: "Teléfono del paciente",
        example: "+34 666 123 456",
      },
      tipo: {
        type: "string",
        enum: ["individual", "group", "family", "couples"],
        description: "Tipo de sesión preferida",
        example: "individual",
      },
      PatientResumeSessions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/PatientResumeSession",
        },
        description: "Historial de sesiones del paciente",
      },
    },
  },

  PatientData: {
    type: "object",
    properties: {
      nombre: {
        type: "string",
        description: "Nombre completo del paciente",
        example: "Juan Pérez García",
      },
      dni: {
        type: "string",
        description: "DNI del paciente",
        example: "12345678A",
      },
      fecha_nacimiento: {
        type: "string",
        format: "date",
        nullable: true,
        description: "Fecha de nacimiento (YYYY-MM-DD)",
        example: "1985-03-15",
      },
      estado: {
        type: "string",
        enum: ["active", "inactive", "discharged", "on-hold"],
        description: "Estado del paciente",
        example: "active",
      },
      email: {
        type: "string",
        format: "email",
        description: "Email del paciente",
        example: "juan.perez@email.com",
      },
      telefono: {
        type: "string",
        description: "Teléfono del paciente",
        example: "+34 666 123 456",
      },
      direccion: {
        type: "string",
        nullable: true,
        description: "Dirección del paciente",
        example: "Calle Mayor 123, Valencia",
      },
      contacto_emergencia: {
        type: "string",
        nullable: true,
        description: "Nombre del contacto de emergencia",
        example: "María Pérez",
      },
      telefono_emergencia: {
        type: "string",
        nullable: true,
        description: "Teléfono del contacto de emergencia",
        example: "+34 666 987 654",
      },
      notas: {
        type: "string",
        nullable: true,
        description: "Notas adicionales",
        example: "Paciente muy colaborativo",
      },
    },
  },

  PatientSession: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único de la sesión",
        example: 1,
      },
      fecha: {
        type: "string",
        format: "date",
        description: "Fecha de la sesión (YYYY-MM-DD)",
        example: "2024-12-15",
      },
      clinica: {
        type: "string",
        nullable: true,
        description: "Nombre de la clínica",
        example: "Clínica Psicológica Centro",
      },
      tipo: {
        type: "string",
        description: "Tipo de sesión",
        example: "Terapia Individual",
      },
      estado: {
        type: "string",
        enum: ["scheduled", "completed", "cancelled", "no-show"],
        description: "Estado de la sesión",
        example: "completed",
      },
      precio: {
        type: "number",
        format: "decimal",
        description: "Precio de la sesión",
        example: 60.0,
      },
      tipo_pago: {
        type: "string",
        enum: ["cash", "card", "transfer", "insurance"],
        description: "Método de pago",
        example: "card",
      },
      notas: {
        type: "string",
        nullable: true,
        description: "Notas de la sesión",
        example: "Sesión muy productiva, buen progreso del paciente",
      },
    },
  },

  PatientDetailResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "object",
        properties: {
          PatientResume: {
            oneOf: [
              { $ref: "#/components/schemas/PatientResume" },
              { type: "null" }
            ],
          },
          PatientData: {
            oneOf: [
              { $ref: "#/components/schemas/PatientData" },
              { type: "object" }
            ],
            description: "Datos detallados del paciente",
          },
          PatientMedicalRecord: {
            type: "array", 
            items: {},
            description: "Historial médico del paciente (vacío por ahora)",
            example: [],
          },
          PatientSessions: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PatientSession",
            },
            description: "Sesiones detalladas del paciente",
          },
          PatientInvoice: {
            type: "array",
            items: {},
            description: "Facturas del paciente (vacío por ahora)", 
            example: [],
          },
          PatientBonus: {
            type: "array",
            items: {},
            description: "Bonos del paciente (vacío por ahora)",
            example: [],
          },
        },
      },
    },
  },

  ErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      error: {
        type: "string",
        example: "ID de paciente debe ser un número",
      },
      field: {
        type: "string",
        example: "patient_id",
      },
      allowed_values: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["scheduled", "completed", "cancelled", "no-show"],
      },
    },
  },
};

module.exports = definitions;
