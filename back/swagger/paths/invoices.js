const invoicesPaths = {
  "/api/invoices": {
    post: {
      tags: ["Invoices"],
      summary: "Generar factura",
      description:
        "Crea una nueva factura para un paciente, asocia las sesiones especificadas, las marca como facturadas (invoiced = 1) y registra las relaciones en invoice_sessions. Todo el proceso se ejecuta en una transacción.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["invoice_number", "invoice_date", "patient_id", "session_ids", "concept"],
              properties: {
                invoice_number: {
                  type: "string",
                  description: "Número único de la factura (ej: 2025-001)",
                  example: "2025-001",
                },
                invoice_date: {
                  type: "string",
                  format: "date",
                  description: "Fecha de emisión de la factura (YYYY-MM-DD)",
                  example: "2025-01-15",
                },
                patient_id: {
                  type: "integer",
                  description: "ID del paciente",
                  example: 123,
                },
                session_ids: {
                  type: "array",
                  items: {
                    type: "integer",
                  },
                  description: "IDs de las sesiones a facturar",
                  example: [45, 46, 47, 48],
                },
                concept: {
                  type: "string",
                  description: "Concepto o descripción del servicio facturado",
                  example: "Sesiones de psicología - Enero 2025",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Factura generada exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateInvoiceResponse",
              },
            },
          },
        },
        400: {
          description: "Datos inválidos o faltantes",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Número de factura duplicado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Error del servidor",
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
  "/api/invoices/kpis": {
    get: {
      tags: ["Invoices"],
      summary: "Obtener KPIs de facturación",
      description:
        "Obtiene los KPIs de facturación incluyendo: 1) Total facturas emitidas, 2) Total bruto histórico, 3) Total bruto filtrado por mes/año, 4) Total neto filtrado por mes/año, 5) Total neto por clínica filtrado por mes/año. Si no se especifica mes/año, usa el mes y año actual.",
      parameters: [
        {
          name: "month",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 12,
          },
          description: "Mes para filtrar (1-12). Por defecto usa el mes actual.",
        },
        {
          name: "year",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 2000,
          },
          description: "Año para filtrar (ej: 2025). Por defecto usa el año actual.",
        },
      ],
      responses: {
        200: {
          description: "KPIs obtenidos exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InvoiceKPIsResponse",
              },
            },
          },
        },
        400: {
          description: "Parámetros inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Error del servidor",
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
  "/api/invoices/pending": {
    get: {
      tags: ["Invoices"],
      summary: "Obtener sesiones pendientes de facturar",
      description:
        "Obtiene las sesiones pendientes de facturar agrupadas por paciente. Incluye información del paciente, número de sesiones, total bruto y los IDs de las sesiones. Si no se especifica mes/año, usa el mes y año actual.",
      parameters: [
        {
          name: "month",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 12,
          },
          description: "Mes para filtrar (1-12). Por defecto usa el mes actual.",
        },
        {
          name: "year",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 2000,
          },
          description: "Año para filtrar (ej: 2025). Por defecto usa el año actual.",
        },
      ],
      responses: {
        200: {
          description: "Sesiones pendientes obtenidas exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PendingInvoicesResponse",
              },
            },
          },
        },
        400: {
          description: "Parámetros inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Error del servidor",
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

module.exports = invoicesPaths;
