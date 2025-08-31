const definitions = {
  Bonus: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único del bonus",
        example: 1,
      },
      patient_id: {
        type: "integer",
        format: "int64",
        description: "ID del paciente",
        example: 1,
      },
      total_sessions: {
        type: "integer",
        description: "Número total de sesiones incluidas en el bonus",
        example: 10,
      },
      price_per_session: {
        type: "number",
        format: "decimal",
        description: "Precio por sesión",
        example: 50.00,
      },
      total_price: {
        type: "number",
        format: "decimal",
        description: "Precio total del bonus",
        example: 500.00,
      },
      used_sessions: {
        type: "integer",
        description: "Número de sesiones utilizadas",
        example: 3,
      },
      status: {
        type: "string",
        enum: ["active", "consumed", "expired"],
        description: "Estado del bonus",
        example: "active",
      },
      purchase_date: {
        type: "string",
        format: "date",
        description: "Fecha de compra del bonus (YYYY-MM-DD)",
        example: "2024-01-15",
      },
      expiry_date: {
        type: "string",
        format: "date",
        description: "Fecha de expiración del bonus (YYYY-MM-DD)",
        example: "2024-12-31",
      },
      notes: {
        type: "string",
        nullable: true,
        description: "Notas adicionales",
        example: "Bonus adquirido con descuento especial",
      },
      created_at: {
        type: "string",
        format: "date",
        description: "Fecha de creación",
        example: "2024-01-15",
      },
      updated_at: {
        type: "string",
        format: "date-time",
        description: "Fecha de última actualización",
        example: "2024-01-20T14:45:00Z",
      },
    },
  },

  BonusesResponse: {
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
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Bonus",
        },
      },
    },
  },

  BonusHistoryInfo: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único del bonus",
        example: 1,
      },
      patient_id: {
        type: "integer",
        format: "int64",
        description: "ID del paciente",
        example: 1,
      },
      total_sessions: {
        type: "integer",
        description: "Número total de sesiones incluidas",
        example: 10,
      },
      used_sessions: {
        type: "integer",
        description: "Sesiones ya utilizadas",
        example: 3,
      },
      remaining_sessions: {
        type: "integer",
        description: "Sesiones restantes",
        example: 7,
      },
      progress_percentage: {
        type: "number",
        format: "decimal",
        description: "Porcentaje de progreso del bonus",
        example: 30.00,
      },
      price_per_session: {
        type: "number",
        format: "decimal",
        description: "Precio por sesión",
        example: 50.00,
      },
      total_price: {
        type: "number",
        format: "decimal",
        description: "Precio total del bonus",
        example: 500.00,
      },
      status: {
        type: "string",
        enum: ["active", "consumed", "expired"],
        description: "Estado del bonus",
        example: "active",
      },
      purchase_date: {
        type: "string",
        format: "date",
        description: "Fecha de compra (YYYY-MM-DD)",
        example: "2024-01-15",
      },
      expiry_date: {
        type: "string",
        format: "date",
        description: "Fecha de expiración (YYYY-MM-DD)",
        example: "2025-01-15",
      },
      notes: {
        type: "string",
        nullable: true,
        description: "Notas del bonus",
        example: "Bonus promocional",
      },
      created_at: {
        type: "string",
        format: "date-time",
        description: "Fecha de creación",
        example: "2024-01-15 10:30:00",
      },
    },
  },

  BonusHistoryResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "object",
        properties: {
          used_sessions: {
            type: "integer",
            description: "Sesiones ya utilizadas",
            example: 3,
          },
          remaining_sessions: {
            type: "integer",
            description: "Sesiones restantes",
            example: 7,
          },
          progress_percentage: {
            type: "number",
            format: "decimal",
            description: "Porcentaje de progreso del bonus",
            example: 30.00,
          },
          sessions_history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                used_date: {
                  type: "string",
                  format: "date",
                  description: "Fecha de realización (YYYY-MM-DD)",
                  example: "2024-02-01",
                },
                session_id: {
                  type: "integer",
                  format: "int64",
                  nullable: true,
                  description: "ID de la sesión",
                  example: 25,
                }
              },
            },
            description: "Historial de sesiones realizadas ordenado por fecha descendente",
          },
        },
      },
    },
  },

  BonusUsageHistoryItem: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único del registro de uso",
        example: 1,
      },
      session_id: {
        type: "integer",
        format: "int64",
        nullable: true,
        description: "ID de la sesión asociada",
        example: 25,
      },
      used_date: {
        type: "string",
        format: "date",
        description: "Fecha de uso (YYYY-MM-DD)",
        example: "2024-02-01",
      },
      notes: {
        type: "string",
        nullable: true,
        description: "Notas del uso",
        example: "Sesión completada exitosamente",
      },
      created_by: {
        type: "string",
        nullable: true,
        description: "Usuario que registró el uso",
        example: "admin",
      },
    },
  },

  ClinicData: {
    type: "object",
    properties: {
      clinic_id: {
        type: "integer",
        format: "int64",
        description: "ID de la clínica",
        example: 1,
      },
      clinic_name: {
        type: "string",
        description: "Nombre de la clínica",
        example: "Clínica Psicológica Centro",
      },
    },
  },

  ClinicalNote: {
    type: "object",
    properties: {
      titulo: {
        type: "string",
        description: "Título de la nota clínica",
        example: "Sesión inicial de evaluación",
      },
      contenido: {
        type: "string",
        description: "Contenido completo de la nota clínica",
        example: "El paciente se muestra colaborativo durante la primera sesión. Se observa ansiedad leve relacionada con el trabajo.",
      },
      fecha: {
        type: "string",
        format: "date-time",
        description: "Fecha y hora de la nota clínica (YYYY-MM-DD HH:mm:ss)",
        example: "2024-12-15 14:30:00",
      },
    },
  },

  CreateBonusRequest: {
    type: "object",
    required: ["patient_id", "total_sessions", "price_per_session", "total_price"],
    properties: {
      patient_id: {
        type: "integer",
        format: "int64",
        description: "ID del paciente",
        example: 1,
      },
      total_sessions: {
        type: "integer",
        description: "Número total de sesiones incluidas en el bonus",
        example: 10,
      },
      price_per_session: {
        type: "number",
        format: "decimal",
        description: "Precio por sesión en euros",
        example: 50.00,
      },
      total_price: {
        type: "number",
        format: "decimal",
        description: "Precio total del bonus",
        example: 500.00,
      },
    },
  },

  CreateBonusResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Bonus creado exitosamente",
      },
      data: {
        $ref: "#/components/schemas/PatientBonusDetail",
      },
    },
  },

  DashboardKPIsResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/RapidKPIData",
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

  MedicalRecord: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Título de la nota clínica",
        example: "Sesión inicial de evaluación",
      },
      content: {
        type: "string",
        description: "Contenido completo de la nota clínica",
        example: "El paciente se muestra colaborativo durante la primera sesión. Se observa ansiedad leve relacionada con el trabajo.",
      },
      date: {
        type: "string",
        format: "date-time",
        description: "Fecha y hora de la nota clínica (YYYY-MM-DD HH:mm:ss)",
        example: "2024-12-15 14:30:00",
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

  PatientBonusDetail: {
    type: "object",
    properties: {
      idBono: {
        type: "integer",
        format: "int64",
        description: "ID único del bonus",
        example: 1,
      },
      sesiones_totales: {
        type: "integer",
        description: "Número total de sesiones incluidas",
        example: 10,
      },
      euros_por_sesion: {
        type: "number",
        format: "decimal",
        description: "Precio por sesión en euros",
        example: 50.00,
      },
      precio_total: {
        type: "number",
        format: "decimal",
        description: "Precio total del bonus",
        example: 500.00,
      },
      fecha_compra: {
        type: "string",
        format: "date",
        description: "Fecha de compra del bonus (YYYY-MM-DD)",
        example: "2024-01-15",
      },
      fecha_expiracion: {
        type: "string",
        format: "date",
        description: "Fecha de expiración del bonus (YYYY-MM-DD)",
        example: "2024-12-31",
      },
      sesiones_restantes: {
        type: "integer",
        description: "Sesiones restantes por usar",
        example: 7,
      },
      sesiones_utilizadas: {
        type: "integer",
        description: "Sesiones ya utilizadas",
        example: 3,
      },
      estado_bono: {
        type: "string",
        enum: ["active", "consumed", "expired"],
        description: "Estado actual del bonus",
        example: "active",
      },
    },
  },

  PatientBonusesData: {
    type: "object",
    properties: {
      kpis: {
        $ref: "#/components/schemas/PatientBonusKpis",
      },
      bonuses: {
        type: "array",
        items: {
          $ref: "#/components/schemas/PatientBonusDetail",
        },
        description: "Lista detallada de bonuses del paciente",
      },
    },
  },

  PatientBonusesResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "object",
        properties: {
          kpis: {
            $ref: "#/components/schemas/PatientBonusKpis",
          },
          bonuses: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PatientBonusDetail",
            },
            description: "Lista detallada de bonuses del paciente",
          },
        },
      },
    },
  },

  PatientBonusKpis: {
    type: "object",
    properties: {
      total_bonos: {
        type: "integer",
        description: "Total de bonuses del paciente",
        example: 5,
      },
      total_activos: {
        type: "integer", 
        description: "Total de bonuses activos",
        example: 2,
      },
      total_consumidos: {
        type: "integer",
        description: "Total de bonuses consumidos",
        example: 2,
      },
      total_expirados: {
        type: "integer",
        description: "Total de bonuses expirados",
        example: 1,
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
            items: {
              $ref: "#/components/schemas/ClinicalNote",
            },
            description: "Historial de notas clínicas del paciente",
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
            oneOf: [
              { $ref: "#/components/schemas/PatientBonusesData" },
              { type: "object" }
            ],
            description: "Bonuses del paciente con KPIs y detalles",
          },
        },
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

  RapidKPIData: {
    type: "object",
    properties: {
      sesiones_mes: {
        type: "integer",
        description: "Número de sesiones del mes actual",
        example: 45,
      },
      sesiones_variacion: {
        type: "number",
        format: "decimal",
        description: "Porcentaje de variación vs mes anterior (positivo o negativo)",
        example: 12.5,
      },
      ingresos_mes: {
        type: "number",
        format: "decimal",
        description: "Ingresos del mes actual en euros",
        example: 2750.00,
      },
      ingresos_variacion: {
        type: "number",
        format: "decimal", 
        description: "Porcentaje de variación de ingresos vs mes anterior",
        example: -8.3,
      },
      pacientes_activos: {
        type: "integer",
        description: "Número de pacientes activos",
        example: 28,
      },
      pacientes_nuevos_mes: {
        type: "integer",
        description: "Nuevos pacientes este mes",
        example: 5,
      },
      proximas_citas_hoy: {
        type: "integer",
        description: "Número de citas programadas para hoy",
        example: 6,
      },
      siguiente_cita_hora: {
        type: "string",
        format: "time",
        nullable: true,
        description: "Hora de la siguiente cita de hoy (HH:MM:SS) o null si no hay más",
        example: "14:30:00",
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
      patient_name: {
        type: "string",
        description: "Nombre del paciente",
        example: "Juan Pérez García",
      },
    },
  },

  SessionData: {
    type: "object",
    properties: {
      session_id: {
        type: "integer",
        format: "int64",
        description: "ID único de la sesión",
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
      type: {
        type: "string",
        description: "Tipo de sesión",
        example: "Terapia Individual",
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
      completed: {
        type: "boolean",
        description: "Si la sesión está completada o no",
        example: true,
      },
      notes: {
        type: "string",
        description: "Notas de la sesión",
        example: "Primera sesión del paciente",
      },
      PatientData: {
        $ref: "#/components/schemas/SessionPatientData",
      },
      ClinicDetailData: {
        $ref: "#/components/schemas/ClinicData",
      },
      MedicalRecordData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/MedicalRecord",
        },
      },
    },
  },

  SessionDetailResponse: {
    type: "object",
    properties: {
      SessionDetailData: {
        $ref: "#/components/schemas/SessionData",
      },
    },
  },

  SessionPatientData: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID del paciente",
        example: 1,
      },
      name: {
        type: "string",
        description: "Nombre completo del paciente",
        example: "Juan Pérez García",
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
          $ref: "#/components/schemas/SessionDetailResponse",
        },
      },
    },
  },

  UseBonusSessionResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Sesión registrada exitosamente",
      },
      data: {
        type: "object",
        properties: {
          history_id: {
            type: "integer",
            format: "int64",
            description: "ID del registro de historial creado",
            example: 15,
          },
          bonus_id: {
            type: "integer",
            format: "int64",
            description: "ID del bonus",
            example: 5,
          },
          new_used_sessions: {
            type: "integer",
            description: "Nuevo número de sesiones utilizadas",
            example: 4,
          },
          remaining_sessions: {
            type: "integer",
            description: "Sesiones restantes",
            example: 6,
          },
          new_status: {
            type: "string",
            enum: ["active", "consumed", "expired"],
            description: "Nuevo estado del bonus",
            example: "active",
          },
        },
      },
    },
  },
};

module.exports = definitions;