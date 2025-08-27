const sessionsPaths = {
    '/api/sessions': {
        get: {
            tags: ['Sessions'],
            summary: 'Obtener sesiones',
            description: 'Obtiene una lista de sesiones con filtros opcionales',
            parameters: [
                {
                    name: 'patient_id',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        format: 'int64'
                    },
                    description: 'ID del paciente para filtrar',
                    example: 1
                },
                {
                    name: 'clinic_id', 
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        format: 'int64'
                    },
                    description: 'ID de la clínica para filtrar',
                    example: 1
                },
                {
                    name: 'status',
                    in: 'query', 
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['scheduled', 'completed', 'cancelled', 'no-show']
                    },
                    description: 'Estado de la sesión',
                    example: 'completed'
                },
                {
                    name: 'session_date',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        format: 'date'
                    },
                    description: 'Fecha de la sesión (YYYY-MM-DD)',
                    example: '2024-12-15'
                },
                {
                    name: 'payment_method',
                    in: 'query',
                    required: false, 
                    schema: {
                        type: 'string',
                        enum: ['cash', 'card', 'transfer', 'insurance']
                    },
                    description: 'Método de pago',
                    example: 'card'
                },
                {
                    name: 'payment_status',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['pending', 'paid', 'partially_paid']
                    },
                    description: 'Estado del pago',
                    example: 'paid'
                }
            ],
            responses: {
                200: {
                    description: 'Lista de sesiones obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/SessionsResponse'
                            }
                        }
                    }
                },
                400: {
                    description: 'Parámetros de entrada inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = sessionsPaths;