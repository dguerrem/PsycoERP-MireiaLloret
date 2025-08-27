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
  },
};

module.exports = sessionsPaths;
