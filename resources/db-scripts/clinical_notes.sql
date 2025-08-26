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

-- Volcando estructura para tabla demopsicologia.clinical_notes
CREATE TABLE IF NOT EXISTS `clinical_notes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `section` varchar(100) NOT NULL,
  `subsection` varchar(100) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_patient_id` (`patient_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_section` (`section`),
  KEY `idx_date` (`date`),
  CONSTRAINT `clinical_notes_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla demopsicologia.clinical_notes: ~0 rows (aproximadamente)
INSERT INTO `clinical_notes` (`id`, `patient_id`, `session_id`, `title`, `content`, `section`, `subsection`, `date`, `created_at`, `updated_at`) VALUES
	(1, 1, 1, 'Evaluación inicial del paciente', 'Paciente de 28 años que acude por primera vez presentando síntomas de ansiedad generalizada. Refiere episodios de nerviosismo, dificultad para concentrarse y trastornos del sueño que han empeorado en los últimos 3 meses. Historia laboral estresante como factor desencadenante.', 'Evaluación Inicial', 'Primera consulta', '2024-01-15 10:30:00', '2025-08-26 05:48:17', '2025-08-26 05:48:17'),
	(2, 1, 3, 'Progreso en técnicas de relajación', 'El paciente ha mostrado una mejoría notable en la aplicación de técnicas de respiración profunda. Ha practicado diariamente los ejercicios enseñados en sesiones anteriores. Reporta una reducción del 40% en los episodios de ansiedad aguda. Se continuará con el plan establecido.', 'Progreso Terapéutico', 'Técnicas de manejo', '2024-01-29 11:00:00', '2025-08-26 05:48:17', '2025-08-26 05:48:17'),
	(3, 1, NULL, 'Observaciones familiares importantes', 'Durante la entrevista familiar se identificaron patrones de comunicación disfuncionales. La madre tiende a ser sobreprotectora, lo que puede estar contribuyendo a mantener los síntomas ansiosos del paciente. Se recomienda incluir sesiones familiares en el tratamiento.', 'Observaciones', 'Contexto familiar', '2024-02-05 16:00:00', '2025-08-26 05:48:17', '2025-08-26 05:48:17'),
	(4, 2, 5, 'Establecimiento de objetivos terapéuticos', 'Se han definido tres objetivos principales para el tratamiento: 1) Reducir la frecuencia de ataques de pánico de 5 por semana a 1 por semana en 8 sesiones, 2) Desarrollar estrategias de afrontamiento para situaciones sociales, 3) Mejorar la autoestima y confianza personal. El paciente muestra buena disposición y motivación.', 'Plan de Tratamiento', 'Objetivos a corto plazo', '2024-02-10 09:15:00', '2025-08-26 05:48:17', '2025-08-26 05:48:17'),
	(5, 2, 7, 'Revisión de medicación y efectos secundarios', 'El paciente reporta efectos secundarios leves del antidepresivo prescrito por su psiquiatra (náuseas matutinas). Se ha coordinado con el médico tratante para evaluar ajuste de dosis. Los síntomas depresivos han mejorado significativamente según escala Beck (puntuación actual: 12, inicial: 28).', 'Progreso Terapéutico', 'Seguimiento farmacológico', '2024-02-24 10:45:00', '2025-08-26 05:48:17', '2025-08-26 05:48:17');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
