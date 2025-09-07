const patientsPaths = {
  "/api/patients": {
    get: {
      tags: ["Patients"],
      summary: "Obtener pacientes",
      description: "Obtiene una lista de pacientes con filtros opcionales",
      parameters: [
        {
          name: "name",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Nombre del paciente (búsqueda parcial)",
        },
        {
          name: "email",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "email",
          },
          description: "Email del paciente (búsqueda parcial)",
        },
        {
          name: "dni",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "DNI del paciente (búsqueda exacta)",
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["active", "inactive", "discharged", "on-hold"],
          },
          description: "Estado del paciente",
        },
        {
          name: "session_type",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["individual", "group", "family", "couples"],
          },
          description: "Tipo de sesión del paciente",
        },
        {
          name: "insurance_provider",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Proveedor de seguros (búsqueda parcial)",
        },
        {
          name: "referred_by",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Referido por (búsqueda parcial)",
        },
        {
          name: "birth_date",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Fecha de nacimiento específica (YYYY-MM-DD)",
        },
        {
          name: "fecha_desde",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Fecha de inicio del rango para filtrar por fecha de creación (YYYY-MM-DD)",
        },
        {
          name: "fecha_hasta",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
          },
          description: "Fecha de fin del rango para filtrar por fecha de creación (YYYY-MM-DD)",
        },
      ],
      responses: {
        200: {
          description: "Lista de pacientes obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PatientsResponse",
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
  "/api/patients/{id}": {
    get: {
      tags: ["Patients"],
      summary: "Obtener paciente por ID",
      description: "Obtiene la información completa de un paciente específico dividida en 6 DTOs",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID único del paciente",
        },
      ],
      responses: {
        200: {
          description: "Información del paciente obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PatientDetailResponse",
              },
            },
          },
        },
        400: {
          description: "ID del paciente inválido o no proporcionado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Paciente no encontrado",
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
      tags: ["Patients"],
      summary: "Eliminar paciente (soft delete)",
      description: "Elimina lógicamente un paciente del sistema estableciendo is_active = false. El paciente permanece en la base de datos pero no aparece en consultas futuras.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "ID único del paciente a eliminar",
        },
      ],
      responses: {
        200: {
          description: "Paciente eliminado exitosamente",
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
                    example: "Paciente eliminado correctamente",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "ID del paciente inválido o no proporcionado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Paciente no encontrado o ya está eliminado",
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

module.exports = patientsPaths;