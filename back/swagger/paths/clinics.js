const clinicsPaths = {
  "/api/clinics": {
    get: {
      tags: ["Clinics"],
      summary: "Obtener clínicas",
      description: "Obtiene una lista de clínicas con filtros opcionales",
      parameters: [
        {
          name: "name",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Nombre de la clínica (búsqueda parcial)",
        },
      ],
      responses: {
        200: {
          description: "Lista de clínicas obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ClinicsResponse",
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

module.exports = clinicsPaths;