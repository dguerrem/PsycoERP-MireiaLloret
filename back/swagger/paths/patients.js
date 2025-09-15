const patientsPaths = {
  "/api/patients/deleted": {
    get: {
      tags: ["Patients"],
      summary: "Obtener pacientes eliminados",
      description: "Obtiene una lista de pacientes que han sido eliminados lógicamente (soft delete)",
      parameters: [
        {
          name: "first_name",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Nombre del paciente (búsqueda parcial)",
        },
        {
          name: "last_name",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Apellidos del paciente (búsqueda parcial)",
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
            enum: ["en curso", "fin del tratamiento", "en pausa", "abandono", "derivación"],
          },
          description: "Estado del tratamiento",
        },
        {
          name: "gender",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["M", "F", "O"],
          },
          description: "Género del paciente (M=Masculino, F=Femenino, O=Otro)",
        },
        {
          name: "occupation",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Ocupación/Escuela/Trabajo (búsqueda parcial)",
        },
        {
          name: "clinic_id",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "ID de la clínica asignada",
        },
        {
          name: "is_minor",
          in: "query",
          required: false,
          schema: {
            type: "boolean",
          },
          description: "Filtrar por menores de edad (true/false)",
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
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          description: "Número de página para la paginación (por defecto: 1)",
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
          description: "Número de registros por página (por defecto: 10, máximo: 100)",
        },
      ],
      responses: {
        200: {
          description: "Lista de pacientes eliminados obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PatientsResponse",
              },
            },
          },
        },
        400: {
          description: "Parámetros de entrada inválidos (página < 1, límite fuera del rango 1-100, etc.)",
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
  "/api/patients": {
    get: {
      tags: ["Patients"],
      summary: "Obtener pacientes",
      description: "Obtiene una lista de pacientes con filtros opcionales",
      parameters: [
        {
          name: "first_name",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Nombre del paciente (búsqueda parcial)",
        },
        {
          name: "last_name",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Apellidos del paciente (búsqueda parcial)",
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
            enum: ["en curso", "fin del tratamiento", "en pausa", "abandono", "derivación"],
          },
          description: "Estado del tratamiento",
        },
        {
          name: "gender",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["M", "F", "O"],
          },
          description: "Género del paciente (M=Masculino, F=Femenino, O=Otro)",
        },
        {
          name: "occupation",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
          description: "Ocupación/Escuela/Trabajo (búsqueda parcial)",
        },
        {
          name: "clinic_id",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "ID de la clínica asignada",
        },
        {
          name: "is_minor",
          in: "query",
          required: false,
          schema: {
            type: "boolean",
          },
          description: "Filtrar por menores de edad (true/false)",
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
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          description: "Número de página para la paginación (por defecto: 1)",
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
          description: "Número de registros por página (por defecto: 10, máximo: 100)",
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
          description: "Parámetros de entrada inválidos (página < 1, límite fuera del rango 1-100, etc.)",
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