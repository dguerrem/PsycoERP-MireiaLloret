const clinicsPaths = {
  "/api/clinics": {
    get: {
      tags: ["Clinics"],
      summary: "Obtener clínicas activas",
      description: "Obtiene una lista de clínicas activas (is_active = true) con paginación",
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          description: "Número de página (por defecto: 1)",
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: "Cantidad de registros por página (por defecto: 10, máximo: 100)",
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
    post: {
      tags: ["Clinics"],
      summary: "Crear nueva clínica",
      description: "Crea una nueva clínica en el sistema",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateClinicRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Clínica creada exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateClinicResponse",
              },
            },
          },
        },
        400: {
          description: "Datos de entrada inválidos",
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
  "/api/clinics/{id}": {
    put: {
      tags: ["Clinics"],
      summary: "Actualizar clínica",
      description: "Actualiza los datos de una clínica existente",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID de la clínica a actualizar",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateClinicRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Clínica actualizada exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessResponse",
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
        404: {
          description: "Clínica no encontrada",
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
    delete: {
      tags: ["Clinics"],
      summary: "Eliminar clínica (soft delete)",
      description: "Elimina lógicamente una clínica del sistema estableciendo is_active = false. La clínica permanece en la base de datos pero no aparece en consultas futuras.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID único de la clínica a eliminar",
        },
      ],
      responses: {
        200: {
          description: "Clínica eliminada exitosamente",
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
                    example: "Clínica eliminada correctamente",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "ID de clínica inválido o no proporcionado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Clínica no encontrada o ya está eliminada",
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