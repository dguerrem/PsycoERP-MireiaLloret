const { getSessions } = require('../../models/sessions/sessions_model');

const obtenerSesiones = async (req, res) => {
    try {
        const { patient_id, status, clinic_id, session_date, payment_status, payment_method } = req.query;
        
        // Lógica de negocio: construir filtros
        const filters = {};
        
        if (patient_id) {
            // Validar que sea un número (bigint en BD)
            if (isNaN(patient_id)) {
                return res.status(400).json({ 
                    error: 'ID de paciente debe ser un número',
                    field: 'patient_id'
                });
            }
            filters.patient_id = patient_id;
        }
        
        if (status) {
            // Validar estados permitidos según ENUM de la BD
            const estadosPermitidos = ['scheduled', 'completed', 'cancelled', 'no-show'];
            if (!estadosPermitidos.includes(status)) {
                return res.status(400).json({ 
                    error: 'Estado inválido',
                    allowed_values: estadosPermitidos,
                    field: 'status'
                });
            }
            filters.status = status;
        }
        
        if (clinic_id) {
            // Validar que sea un número (bigint en BD)
            if (isNaN(clinic_id)) {
                return res.status(400).json({ 
                    error: 'ID de clínica debe ser un número',
                    field: 'clinic_id'
                });
            }
            filters.clinic_id = clinic_id;
        }
        
        if (session_date) {
            // Validar formato de fecha YYYY-MM-DD
            const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
            if (!regexFecha.test(session_date) || isNaN(Date.parse(session_date))) {
                return res.status(400).json({ 
                    error: 'Formato de fecha inválido. Use YYYY-MM-DD',
                    field: 'session_date'
                });
            }
            filters.session_date = session_date;
        }

        if (payment_status) {
            // Validar payment_status según ENUM de la BD
            const paymentStatusPermitidos = ['pending', 'paid', 'partially_paid'];
            if (!paymentStatusPermitidos.includes(payment_status)) {
                return res.status(400).json({ 
                    error: 'Estado de pago inválido',
                    allowed_values: paymentStatusPermitidos,
                    field: 'payment_status'
                });
            }
            filters.payment_status = payment_status;
        }

        if (payment_method) {
            // Validar payment_method según ENUM de la BD
            const paymentMethodsPermitidos = ['cash', 'card', 'transfer', 'insurance'];
            if (!paymentMethodsPermitidos.includes(payment_method)) {
                return res.status(400).json({ 
                    error: 'Método de pago inválido',
                    allowed_values: paymentMethodsPermitidos,
                    field: 'payment_method'
                });
            }
            filters.payment_method = payment_method;
        }

        // Llamar al model para obtener las sesiones
        const sesiones = await getSessions(filters);
        
        // Lógica de negocio: formatear respuesta
        const respuesta = {
            success: true,
            total: sesiones.length,
            filters_applied: Object.keys(filters).length > 0 ? filters : null,
            data: sesiones
        };

        res.json(respuesta);
        
    } catch (err) {
        console.error('❌ Error al obtener sesiones:', err.message);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor',
            message: 'Error al obtener las sesiones'
        });
    }
};

module.exports = {
    obtenerSesiones
};