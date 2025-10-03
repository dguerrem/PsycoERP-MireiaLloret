const invoicesPaths = {
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
};

module.exports = invoicesPaths;
