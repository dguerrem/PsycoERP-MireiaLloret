const sessionsPaths = {
  "/api/sessions": {
    get: {
      tags: ["Sessions"],
      summary: "Obtener sesiones",
      description: "Obtiene una lista de sesiones con filtros opcionales",
      parameters: [
        {
          name: "patient_id",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "ID del paciente para filtrar",
        },
        {
          name: "clinic_id",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "ID de la clínica para filtrar",
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["scheduled", "completed", "cancelled", "no-show"],
          },
          description: "Estado de la sesión",
        },
        {
          name: "session_date",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Fecha de la sesión (YYYY-MM-DD)",
        },
        {
          name: "fecha_desde",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description:
            "Fecha de inicio del rango para filtrar sesiones (YYYY-MM-DD). Solo se usa si no se especifica session_date",
        },
        {
          name: "fecha_hasta",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description:
            "Fecha de fin del rango para filtrar sesiones (YYYY-MM-DD). Solo se usa si no se especifica session_date",
        },
        {
          name: "payment_method",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["cash", "card", "transfer", "insurance"],
          },
          description: "Método de pago",
        },
        {
          name: "payment_status",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["pending", "paid", "partially_paid"],
          },
          description: "Estado del pago",
        },
      ],
      responses: {
        200: {
          description: "Lista de sesiones obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SessionsResponse",
              },
            },
          },
        },
        400: {
          description: "Parámetros de entrada inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Sessions"],
      summary: "Crear nueva sesión",
      description: "Crea una nueva sesión en el sistema",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "patient_id",
                "clinic_id",
                "session_date",
                "start_time",
                "end_time",
                "mode",
                "type",
              ],
              properties: {
                patient_id: {
                  type: "integer",
                  format: "int64",
                  description: "ID del paciente",
                },
                clinic_id: {
                  type: "integer",
                  format: "int64",
                  description: "ID de la clínica",
                },
                session_date: {
                  type: "string",
                  format: "date",
                  description: "Fecha de la sesión (YYYY-MM-DD)",
                },
                start_time: {
                  type: "string",
                  format: "time",
                  description: "Hora de inicio (HH:mm:ss)",
                },
                end_time: {
                  type: "string",
                  format: "time",
                  description: "Hora de fin (HH:mm:ss)",
                },
                mode: {
                  type: "string",
                  description: "Modalidad de la sesión",
                },
                type: {
                  type: "string",
                  description: "Tipo de sesión",
                },
                status: {
                  type: "string",
                  enum: ["scheduled", "completed", "cancelled", "no-show"],
                  default: "scheduled",
                  description: "Estado de la sesión",
                },
                price: {
                  type: "number",
                  format: "decimal",
                  default: 0.0,
                  description: "Precio de la sesión",
                },
                payment_method: {
                  type: "string",
                  enum: ["cash", "card", "transfer", "insurance"],
                  default: "cash",
                  description: "Método de pago",
                },
                payment_status: {
                  type: "string",
                  enum: ["pending", "paid", "partially_paid"],
                  default: "pending",
                  description: "Estado del pago",
                },
                notes: {
                  type: "string",
                  description: "Notas adicionales de la sesión",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Sesión creada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "Sesión creada exitosamente",
                  },
                  data: {
                    $ref: "#/components/schemas/Session",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Campos obligatorios faltantes o datos inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/sessions/{id}": {
    put: {
      tags: ["Sessions"],
      summary: "Actualizar sesión existente",
      description:
        "Actualiza una sesión existente con los datos proporcionados. Solo se actualizan los campos enviados.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "ID de la sesión a actualizar",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                patient_id: {
                  type: "integer",
                  format: "int64",
                  description: "ID del paciente",
                },
                clinic_id: {
                  type: "integer",
                  format: "int64",
                  description: "ID de la clínica",
                },
                session_date: {
                  type: "string",
                  format: "date",
                  description: "Fecha de la sesión (YYYY-MM-DD)",
                },
                start_time: {
                  type: "string",
                  format: "time",
                  description: "Hora de inicio (HH:mm:ss)",
                },
                end_time: {
                  type: "string",
                  format: "time",
                  description: "Hora de fin (HH:mm:ss)",
                },
                mode: {
                  type: "string",
                  description:
                    "Modalidad de la sesión (ej: presencial, online)",
                },
                type: {
                  type: "string",
                  description: "Tipo de sesión (ej: individual, grupal)",
                },
                status: {
                  type: "string",
                  enum: ["scheduled", "completed", "cancelled", "no-show"],
                  description: "Estado de la sesión",
                },
                price: {
                  type: "number",
                  format: "decimal",
                  minimum: 0,
                  description: "Precio de la sesión",
                },
                payment_method: {
                  type: "string",
                  enum: ["cash", "card", "transfer", "insurance"],
                  description: "Método de pago",
                },
                payment_status: {
                  type: "string",
                  enum: ["pending", "paid", "partially_paid"],
                  description: "Estado del pago",
                },
                notes: {
                  type: "string",
                  description: "Notas adicionales de la sesión",
                },
              },
              description:
                "Al menos un campo debe ser proporcionado para la actualización",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Sesión actualizada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "Sesión actualizada exitosamente",
                  },
                  data: {
                    $ref: "#/components/schemas/Session",
                  },
                },
              },
            },
          },
        },
        400: {
          description:
            "ID inválido o no se proporcionaron campos para actualizar",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Sesión no encontrada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};

module.exports = sessionsPaths;
