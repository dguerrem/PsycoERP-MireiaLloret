const definitions = {
  AgeDistributionItem: {
    type: "object",
    properties: {
      age_range: {
        type: "string",
        description: "Rango de edad del grupo",
        enum: ["18-25", "26-35", "36-45", ">45", "Sin datos"],
        example: "26-35",
      },
      patient_count: {
        type: "integer",
        description: "Número de pacientes en este rango de edad",
        example: 12,
      },
    },
  },

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

  Clinic: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "ID único de la clínica",
        example: 1,
      },
      name: {
        type: "string",
        description: "Nombre de la clínica",
        example: "Clínica Psicológica Centro",
      },
      address: {
        type: "string",
        nullable: true,
        description: "Dirección de la clínica",
        example: "Av. Principal 123, Ciudad",
      },
      clinic_color: {
        type: "string",
        nullable: true,
        description: "Color de la clínica en formato hexadecimal",
        example: "#3B82F6",
      },
      created_at: {
        type: "string",
        format: "date",
        description: "Fecha de creación",
        example: "2024-01-15",
      },
      updated_at: {
        type: "string",
        format: "date",
        description: "Fecha de última actualización",
        example: "2024-01-15",
      },
    },
  },

  UpdateClinicRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nombre de la clínica",
        example: "Clínica Psicológica Centro Actualizada",
      },
      address: {
        type: "string",
        nullable: true,
        description: "Dirección de la clínica",
        example: "Av. Principal 456, Ciudad",
      },
      clinic_color: {
        type: "string",
        nullable: true,
        description: "Color de la clínica en formato hexadecimal (#RRGGBB)",
        pattern: "^#[0-9A-Fa-f]{6}$",
        example: "#10B981",
      },
    },
  },

  CreateClinicRequest: {
    type: "object",
    required: ["name", "address", "clinic_color"],
    properties: {
      name: {
        type: "string",
        description: "Nombre de la clínica (requerido)",
        example: "Clínica Psicológica Nueva",
      },
      address: {
        type: "string",
        description: "Dirección de la clínica (requerido)",
        example: "Av. Nueva 789, Ciudad",
      },
      clinic_color: {
        type: "string",
        description: "Color de la clínica en formato hexadecimal (#RRGGBB) (requerido)",
        pattern: "^#[0-9A-Fa-f]{6}$",
        example: "#EF4444",
      },
    },
  },

  CreateClinicResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "Indica si la operación fue exitosa",
        example: true,
      },
      message: {
        type: "string",
        description: "Mensaje de éxito",
        example: "Clínica creada exitosamente",
      },
      data: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
            description: "ID de la nueva clínica",
            example: 5,
          },
          name: {
            type: "string",
            description: "Nombre de la clínica",
            example: "Clínica Psicológica Nueva",
          },
          address: {
            type: "string",
            description: "Dirección de la clínica",
            example: "Av. Nueva 789, Ciudad",
          },
          clinic_color: {
            type: "string",
            description: "Color de la clínica",
            example: "#EF4444",
          },
        },
      },
    },
  },

  DistributionByModalityItem: {
    type: "object",
    properties: {
      modality_type: {
        type: "string",
        description: "Tipo de modalidad de la sesión (presencial/online)",
        example: "Presencial",
      },
      session_count: {
        type: "integer",
        description: "Número total de sesiones realizadas con esta modalidad",
        example: 45,
      },
    },
  },

  SuccessResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "Indica si la operación fue exitosa",
        example: true,
      },
      message: {
        type: "string",
        description: "Mensaje de éxito",
        example: "Operación completada exitosamente",
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

  ClinicsResponse: {
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
          $ref: "#/components/schemas/Clinic",
        },
      },
    },
  },

  ClinicPerformanceItem: {
    type: "object",
    properties: {
      clinic_name: {
        type: "string",
        description: "Nombre de la clínica",
        example: "Clínica Psicológica Centro",
      },
      session_count: {
        type: "integer",
        description: "Número total de sesiones realizadas en esta clínica",
        example: 45,
      },
      average_session_price: {
        type: "number",
        format: "decimal",
        description: "Precio promedio por sesión en euros",
        example: 62.50,
      },
      total_revenue: {
        type: "number",
        format: "decimal",
        description: "Ingresos totales generados por esta clínica",
        example: 2812.50,
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

  DashboardData: {
    type: "object",
    properties: {
      RapidKPIData: {
        $ref: "#/components/schemas/RapidKPIData",
      },
      AgeDistributionData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/AgeDistributionItem",
        },
        description: "Distribución de pacientes activos por rangos de edad",
      },
      ClinicPerformanceData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ClinicPerformanceItem",
        },
        description: "Rendimiento de cada clínica (sesiones, precio promedio, ingresos totales)",
      },
      DistributionByModalityData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/DistributionByModalityItem",
        },
        description: "Distribución de sesiones por modalidad (presencial/online)",
      },
      MonthlyRevenueData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/MonthlyRevenueItem",
        },
        description: "Datos de ingresos por mes",
      },
      PaymentMethodsData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/PaymentMethodsItem",
        },
        description: "Distribución porcentual de métodos de pago utilizados",
      },
      SessionResultData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SessionResultItem",
        },
        description: "Distribución de sesiones por estado (completadas, planificadas, canceladas, no-show)",
      },
      SessionsByClinicData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SessionsByClinicItem",
        },
        description: "Datos de sesiones agrupadas por clínica",
      },
      TodayUpcomingSessionsData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SessionItem",
        },
        description: "Sesiones pendientes de hoy (posteriores a la hora actual)",
      },
      TomorrowSessionsData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SessionItem",
        },
        description: "Todas las sesiones programadas para el próximo día laborable (si es viernes, muestra las del lunes)",
      },
      WeeklySessionsData: {
        type: "array",
        items: {
          $ref: "#/components/schemas/WeeklySessionsItem",
        },
        description: "Sesiones por semana del mes actual para gráfico de barras",
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
        $ref: "#/components/schemas/DashboardData",
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

  MonthlyRevenueItem: {
    type: "object",
    properties: {
      year: {
        type: "integer",
        description: "Año",
        example: 2024,
      },
      month: {
        type: "integer",
        description: "Mes (1-12)",
        example: 8,
      },
      month_name: {
        type: "string",
        description: "Nombre del mes en español",
        example: "agosto",
      },
      revenue: {
        type: "number",
        format: "decimal",
        description: "Ingresos del mes",
        example: 3750.00,
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

  PaymentMethodsItem: {
    type: "object",
    properties: {
      payment_method: {
        type: "string",
        enum: ["cash", "card", "transfer", "insurance"],
        description: "Método de pago utilizado",
        example: "cash",
      },
      percentage: {
        type: "number",
        format: "decimal",
        description: "Porcentaje de uso de este método de pago",
        example: 50.25,
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

  SessionDetail: {
    type: "object",
    properties: {
      session_id: {
        type: "integer",
        format: "int64",
        description: "ID único de la sesión",
        example: 15,
      },
      session_date: {
        type: "string",
        format: "date",
        description: "Fecha de la sesión (YYYY-MM-DD)",
        example: "2024-08-15",
      },
    },
  },

  SessionItem: {
    type: "object",
    properties: {
      start_time: {
        type: "string",
        format: "time",
        description: "Hora de inicio de la sesión (HH:MM:SS)",
        example: "14:30:00",
      },
      patient_name: {
        type: "string",
        description: "Nombre completo del paciente",
        example: "Juan Pérez García",
      },
      session_type: {
        type: "string",
        description: "Modalidad de la sesión (online o presencial)",
        example: "Presencial",
      },
      clinic_name: {
        type: "string",
        description: "Nombre de la clínica",
        example: "Clínica Psicológica Centro",
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

  SessionResultItem: {
    type: "object",
    properties: {
      session_status: {
        type: "string",
        enum: ["scheduled", "completed", "cancelled", "no-show"],
        description: "Estado de la sesión",
        example: "completed",
      },
      session_count: {
        type: "integer",
        description: "Número de sesiones con este estado",
        example: 45,
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

  SessionsByClinicItem: {
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
      total_sessions: {
        type: "integer",
        description: "Total de sesiones en esta clínica",
        example: 45,
      },
      sessions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SessionDetail",
        },
        description: "Detalle de todas las sesiones de esta clínica (para filtros por año en frontend)",
      },
    },
  },

  TodayUpcomingSessionsData: {
    type: "array",
    items: {
      $ref: "#/components/schemas/SessionItem",
    },
    description: "Lista de sesiones pendientes de hoy (posteriores a la hora actual)",
  },

  TomorrowSessionsData: {
    type: "array",
    items: {
      $ref: "#/components/schemas/SessionItem",
    },
    description: "Lista de sesiones del próximo día laborable (viernes→lunes, sábado→lunes, otros→día siguiente)",
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

  WeeklySessionsItem: {
    type: "object",
    properties: {
      week_number: {
        type: "integer",
        description: "Número de semana del mes (1-5)",
        example: 2,
      },
      week_label: {
        type: "string",
        description: "Etiqueta descriptiva de la semana",
        example: "Semana 2",
      },
      session_count: {
        type: "integer",
        description: "Número de sesiones realizadas en esta semana",
        example: 15,
      },
    },
  },
};

module.exports = definitions;