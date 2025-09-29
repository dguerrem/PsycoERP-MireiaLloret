-- Inserts de prueba para el paciente 96
-- Asegúrate de ajustar el clinic_id según las clínicas que tengas en tu base de datos

-- Sesión finalizada - enero 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-01-15',
    '10:00:00',
    '11:00:00',
    'presencial',
    'finalizada',
    60.00,
    'tarjeta',
    'paid',
    'Primera sesión de evaluación'
);

-- Sesión finalizada - febrero 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-02-20',
    '15:30:00',
    '16:30:00',
    'online',
    'finalizada',
    55.00,
    'bizum',
    'paid',
    'Sesión de seguimiento online'
);

-- Sesión finalizada - marzo 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-03-10',
    '11:00:00',
    '12:00:00',
    'presencial',
    'finalizada',
    60.00,
    'efectivo',
    'paid',
    'Sesión presencial muy productiva'
);

-- Sesión programada - diciembre 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-12-28',
    '09:00:00',
    '10:00:00',
    'presencial',
    'programada',
    65.00,
    'pendiente',
    'pending',
    'Sesión de cierre de año'
);

-- Sesión programada - enero 2025
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2025-01-15',
    '14:00:00',
    '15:00:00',
    'online',
    'programada',
    65.00,
    'pendiente',
    'pending',
    'Primera sesión del nuevo año'
);

-- Sesión cancelada - noviembre 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-11-18',
    '16:00:00',
    '17:00:00',
    'presencial',
    'cancelada',
    60.00,
    'pendiente',
    'pending',
    'Cancelada por enfermedad del paciente'
);

-- Sesión finalizada - octubre 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-10-05',
    '12:30:00',
    '13:30:00',
    'online',
    'finalizada',
    58.00,
    'transferencia',
    'paid',
    'Sesión online exitosa'
);

-- Sesión finalizada - septiembre 2024
INSERT INTO sessions (
    patient_id,
    clinic_id,
    session_date,
    start_time,
    end_time,
    mode,
    status,
    price,
    payment_method,
    notes
) VALUES (
    96,
    1,
    '2024-09-22',
    '10:30:00',
    '11:30:00',
    'presencial',
    'finalizada',
    62.00,
    'tarjeta',
    'paid',
    'Buen progreso del paciente'
);