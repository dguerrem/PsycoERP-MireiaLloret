const definitions = {
    Session: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                format: 'int64',
                description: 'ID único de la sesión',
                example: 1
            },
            patient_id: {
                type: 'integer',
                format: 'int64', 
                description: 'ID del paciente',
                example: 1
            },
            clinic_id: {
                type: 'integer',
                format: 'int64',
                description: 'ID de la clínica', 
                example: 1
            },
            session_date: {
                type: 'string',
                format: 'date',
                description: 'Fecha de la sesión (YYYY-MM-DD)',
                example: '2024-12-15'
            },
            start_time: {
                type: 'string',
                format: 'time',
                description: 'Hora de inicio (HH:MM:SS)',
                example: '09:00:00'
            },
            end_time: {
                type: 'string', 
                format: 'time',
                description: 'Hora de finalización (HH:MM:SS)',
                example: '10:00:00'
            },
            mode: {
                type: 'string',
                description: 'Modalidad de la sesión',
                example: 'Presencial'
            },
            type: {
                type: 'string',
                description: 'Tipo de terapia',
                example: 'Terapia Individual'
            },
            status: {
                type: 'string',
                enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
                description: 'Estado de la sesión',
                example: 'scheduled'
            },
            price: {
                type: 'number',
                format: 'decimal',
                description: 'Precio de la sesión',
                example: 60.00
            },
            payment_method: {
                type: 'string',
                enum: ['cash', 'card', 'transfer', 'insurance'],
                description: 'Método de pago',
                example: 'card'
            },
            payment_status: {
                type: 'string',
                enum: ['pending', 'paid', 'partially_paid'],
                description: 'Estado del pago',
                example: 'pending'
            },
            notes: {
                type: 'string',
                description: 'Notas adicionales',
                example: 'Primera sesión del paciente'
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de creación'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de última actualización'
            }
        }
    },

    SessionsResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            total: {
                type: 'integer',
                example: 3
            },
            filters_applied: {
                type: 'object',
                nullable: true,
                example: {
                    patient_id: "1",
                    status: "completed"
                }
            },
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Session'
                }
            }
        }
    },

    ErrorResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: false
            },
            error: {
                type: 'string',
                example: 'ID de paciente debe ser un número'
            },
            field: {
                type: 'string',
                example: 'patient_id'
            },
            allowed_values: {
                type: 'array',
                items: {
                    type: 'string'
                },
                example: ['scheduled', 'completed', 'cancelled', 'no-show']
            }
        }
    }
};

module.exports = definitions;