const bonusesPaths = {
  "/api/bonuses": {
    get: {
      tags: ["Bonuses"],
      summary: "Obtener bonuses",
      description: "Obtiene una lista de bonuses con filtros opcionales",
      parameters: [
        {
          name: "patient_id",
          in: "query",
          required: false,
          schema: {
            type: "integer",
          },
          description: "ID del paciente",
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["active", "consumed", "expired"],
          },
          description: "Estado del bonus",
        },
        {
          name: "fecha_desde",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Fecha de inicio del rango para filtrar por fecha de compra (YYYY-MM-DD)",
        },
        {
          name: "fecha_hasta",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Fecha de fin del rango para filtrar por fecha de compra (YYYY-MM-DD)",
        },
      ],
      responses: {
        200: {
          description: "Lista de bonuses obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BonusesResponse",
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

module.exports = bonusesPaths;