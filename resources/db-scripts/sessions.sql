-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         12.0.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para demopsicologia
CREATE DATABASE IF NOT EXISTS `demopsicologia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `demopsicologia`;

-- Volcando estructura para tabla demopsicologia.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) NOT NULL,
  `clinic_id` bigint(20) NOT NULL,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` enum('scheduled','completed','cancelled','no-show') DEFAULT 'scheduled',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` enum('cash','card','transfer','insurance') DEFAULT 'cash',
  `payment_status` enum('pending','paid','partially_paid') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_session_patient` (`patient_id`),
  KEY `idx_session_date` (`session_date`),
  KEY `idx_session_status` (`status`),
  KEY `idx_session_clinic` (`clinic_id`),
  KEY `idx_session_patient_date` (`patient_id`,`session_date` DESC),
  KEY `idx_session_date_status` (`session_date`,`status`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sessions_ibfk_3` FOREIGN KEY (`clinic_id`) REFERENCES `clinics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla demopsicologia.sessions: ~15 rows (aproximadamente)
INSERT INTO `sessions` (`id`, `patient_id`, `clinic_id`, `session_date`, `start_time`, `end_time`, `type`, `status`, `price`, `payment_method`, `payment_status`, `notes`, `created_at`, `updated_at`) VALUES
	(1, 1, 1, '2024-12-15', '09:00:00', '10:00:00', 'Terapia Individual', 'completed', 60.00, 'card', 'paid', 'Primera sesión del paciente. Muy colaborativo.', '2025-08-25 19:19:47', '2025-08-25 19:24:16'),
	(2, 1, 2, '2024-12-22', '09:00:00', '10:00:00', 'Terapia Individual', 'completed', 60.00, 'card', 'paid', 'Evolución positiva. Paciente refiere menos episodios de ansiedad.', '2025-08-25 19:19:47', '2025-08-25 19:24:18'),
	(3, 1, 3, '2025-01-05', '09:00:00', '10:00:00', 'Terapia Individual', 'scheduled', 60.00, 'card', 'pending', 'Sesión programada para seguimiento.', '2025-08-25 19:19:47', '2025-08-25 19:24:19'),
	(4, 2, 4, '2024-11-20', '17:00:00', '18:30:00', 'Terapia Familiar', 'completed', 80.00, 'transfer', 'paid', 'Primera sesión familiar. Asisten paciente y cónyuge.', '2025-08-25 19:19:47', '2025-08-25 19:24:20'),
	(5, 2, 1, '2024-12-04', '17:00:00', '18:30:00', 'Terapia Familiar', 'completed', 80.00, 'transfer', 'paid', 'Avances significativos en comunicación. Ambiente más relajado.', '2025-08-25 19:19:47', '2025-08-25 19:24:21'),
	(6, 2, 2, '2024-12-18', '17:00:00', '18:30:00', 'Terapia Familiar', 'completed', 80.00, 'transfer', 'paid', 'Sesión muy productiva. Resolución de conflictos efectiva.', '2025-08-25 19:19:47', '2025-08-25 19:24:23'),
	(7, 3, 3, '2024-10-15', '11:00:00', '12:00:00', 'Terapia Individual', 'completed', 65.00, 'cash', 'paid', 'Última sesión antes de pausa laboral.', '2025-08-25 19:19:47', '2025-08-25 19:24:24'),
	(8, 3, 4, '2025-01-15', '11:00:00', '12:00:00', 'Terapia Individual', 'scheduled', 65.00, 'cash', 'pending', 'Retoma tras pausa laboral.', '2025-08-25 19:19:47', '2025-08-25 19:24:25'),
	(9, 4, 1, '2024-12-10', '19:00:00', '20:30:00', 'Terapia de Pareja', 'completed', 90.00, 'card', 'paid', 'Sesión intensa pero constructiva.', '2025-08-25 19:19:47', '2025-08-25 19:24:26'),
	(10, 4, 2, '2024-12-24', '19:00:00', '20:30:00', 'Terapia de Pareja', 'cancelled', 90.00, 'card', 'pending', 'Cancelada por festividades navideñas.', '2025-08-25 19:19:47', '2025-08-25 19:24:29'),
	(11, 4, 3, '2025-01-07', '19:00:00', '20:30:00', 'Terapia de Pareja', 'scheduled', 90.00, 'card', 'pending', 'Retoma después de vacaciones.', '2025-08-25 19:19:47', '2025-08-25 19:24:30'),
	(12, 5, 4, '2023-11-15', '18:00:00', '19:30:00', 'Terapia Grupal', 'completed', 45.00, 'insurance', 'paid', 'Última sesión del programa. Evolución excelente.', '2025-08-25 19:19:47', '2025-08-25 19:24:32'),
	(13, 1, 1, '2024-11-30', '10:30:00', '11:00:00', 'Consulta General', 'completed', 40.00, 'insurance', 'paid', 'Revisión médica general previa a inicio de terapia.', '2025-08-25 19:19:47', '2025-08-25 19:19:47'),
	(14, 2, 2, '2024-10-25', '16:00:00', '16:30:00', 'Consulta Cardiológica', 'completed', 50.00, 'insurance', 'paid', 'Revisión por antecedentes familiares de cardiopatía.', '2025-08-25 19:19:47', '2025-08-25 19:19:47'),
	(15, 3, 3, '2024-09-20', '11:00:00', '12:00:00', 'Terapia Individual', 'no-show', 65.00, 'cash', 'pending', 'Paciente no asistió. Se reprograma.', '2025-08-25 19:19:47', '2025-08-25 19:24:34');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
