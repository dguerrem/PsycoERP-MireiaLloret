# PsyClinic Pro - Sistema de Gestión Multi-Clínica para Psicólogos

## 🎯 **Contexto de la Demo**
Sistema especializado para psicólogos que trabajan en múltiples clínicas y necesitan:
- Gestionar pacientes de diferentes centros (3 clínicas + privados)
- Distinguir sesiones por clínica para facturación diferenciada
- Automatizar la generación de facturas por lotes
- Llevar historiales clínicos digitales organizados

## ✨ **Características Principales**

### 📅 **Calendario Multi-Clínica**
- Vista semanal y mensual con citas por horas
- 4 códigos de color para distinguir clínicas:
  - 🟦 Clínica A (Azul)
  - 🟩 Clínica B (Verde)  
  - 🟨 Clínica C (Amarillo)
  - 🟪 Privados (Morado)
- Popup de sesión completa al hacer clic en cita

### 👥 **Gestión Avanzada de Pacientes**
- Fichas de pacientes con 6 tabs especializados:
  - **Resumen**: Métricas rápidas y datos clave
  - **Datos del Paciente**: Información personal completa
  - **Historia Clínica**: Interfaz tipo OneNote con apartados
  - **Sesiones**: Tabla detallada con filtros
  - **Facturas**: Gestión completa de facturación
  - **Bonos**: Sistema de bonos promocionales

### 📊 **Módulo de Sesiones**
- Tabla principal con filtros avanzados:
  - Por rango de fechas
  - Por clínica (embudo de filtros)
  - Por profesional y tipo
- Exportación a Excel de datos filtrados
- Métricas de sesiones por clínica para facturación

### 💰 **Facturación Inteligente**
- Generación de facturas por lotes por clínica
- Editor de números de factura personalizables
- Descarga masiva de PDFs
- Facturas estéticas que se salen de lo convencional
- Diferenciación por tipo de clínica (algunas hacen sus facturas, otras no)

### 🎨 **Diseño Profesional y Divertido**
- Paleta de colores moderna y vibrante
- Interfaz que rompe con el típico blanco y negro de ERPs
- Microanimaciones y transiciones suaves
- Responsive design para todos los dispositivos

## 🛠️ **Stack Técnico**
- **Frontend**: Angular 17+ con Standalone Components
- **Estado**: Angular Signals para reactividad
- **Estilos**: Tailwind CSS + componentes custom
- **Gráficos**: Chart.js para visualizaciones
- **Calendarios**: FullCalendar integration
- **Tablas**: Angular Material Table con filtros avanzados
- **PDFs**: jsPDF para generación de facturas
- **Exportación**: SheetJS para Excel
- **Datos**: Completamente mockeados (sin backend)

## 📁 **Estructura del Proyecto**
```
src/app/
├── core/
│   ├── models/           # Interfaces y tipos
│   ├── services/         # Servicios de datos mockeados
│   └── guards/           # Guards de navegación
├── features/
│   ├── calendar/         # Calendario multi-clínica
│   ├── patients/         # Gestión completa de pacientes
│   ├── sessions/         # Tabla de sesiones y filtros
│   ├── billing/          # Facturación y PDFs
│   └── session-popup/    # Popup detalle de sesión
├── shared/
│   ├── components/       # Componentes reutilizables
│   ├── pipes/           # Pipes personalizados
│   └── utils/           # Utilidades y helpers
└── layout/
    ├── sidebar/         # Menú lateral estilo ERP
    └── header/          # Cabecera principal
```

## 🚀 **Desarrollo en Fases**

### Fase 1: Base y Navegación
- Layout principal con sidebar ERP
- Estructura de rutas y navegación
- Configuración de tema y colores

### Fase 2: Calendario Multi-Clínica  
- Calendario con vistas semanal/mensual
- Sistema de colores por clínica
- Creación y edición de citas

### Fase 3: Gestión de Pacientes
- Sistema completo de fichas con 6 tabs
- Historia clínica tipo OneNote
- Gestión de bonos promocionales

### Fase 4: Sesiones y Reportes
- Tabla principal de sesiones
- Sistema de filtros avanzados
- Exportación a Excel

### Fase 5: Facturación Avanzada
- Generación de facturas por lotes
- PDFs estéticos personalizados
- Sistema de descarga masiva

## 🎨 **Paleta de Colores**
- **Clínica A**: `#3B82F6` (Azul vibrante)
- **Clínica B**: `#10B981` (Verde esmeralda)
- **Clínica C**: `#F59E0B` (Ámbar)
- **Privados**: `#8B5CF6` (Púrpura)
- **Fondo**: `#F8FAFC` (Gris muy claro)
- **Acentos**: `#1E293B` (Gris oscuro)

## 📝 **Notas de Implementación**
- Todos los datos son mockeados pero realistas
- Funcionalidades de exportación simuladas
- Interfaz optimizada para uso diario intensivo
- Foco en la experiencia del usuario psicólogo