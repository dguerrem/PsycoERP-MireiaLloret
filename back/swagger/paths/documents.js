const documentsPaths = {
  "/api/documents/patient/{patient_id}": {
    get: {
      tags: ["Documents"],
      summary: "Get documents by patient ID",
      description:
        "Retrieves all documents for a specific patient, ordered by upload date (most recent first).",
      parameters: [
        {
          name: "patient_id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            format: "int64",
          },
          description: "Patient ID",
          example: 123,
        },
      ],
      responses: {
        200: {
          description: "Documents retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  total: {
                    type: "integer",
                    description: "Total number of documents found",
                    example: 3,
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Document",
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid patient ID",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                missing_id: {
                  summary: "Missing patient ID",
                  value: {
                    success: false,
                    error: "Patient ID is required",
                  },
                },
                invalid_id: {
                  summary: "Invalid patient ID format",
                  value: {
                    success: false,
                    error: "Patient ID must be a valid number",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                error: "Error retrieving patient documents",
              },
            },
          },
        },
      },
    },
  },
};

module.exports = documentsPaths;
