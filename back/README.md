💻 Backend del Proyecto
Guía rápida para poner en marcha el backend.

🚀 Stack Tecnológico
Tecnología

Descripción

Node.js

Entorno de ejecución de JavaScript.

Express

Framework web para crear la API REST.

Nodemon

Reinicia el servidor automáticamente.

MariaDB

Base de datos relacional.

🛠️ Puesta en Marcha
1. Requisitos del sistema
Asegúrate de tener instalados los siguientes componentes:

Node.js 20.13.1: Descarga aquí. Verifica la instalación con node -v.

HeidiSQL (Portable): Para gestionar la base de datos. Descarga aquí.

2. Configuración del proyecto
Abre tu terminal y navega hasta la carpeta del proyecto.

Instala las dependencias necesarias:

npm install
Inicia el servidor en modo de desarrollo:

nodemon app.js
🚨 Solución de Problemas (Windows)
Si encuentras el error de política de ejecución en PowerShell:

nodemon : No se puede cargar el archivo...

Esto sucede porque PowerShell tiene la ejecución de scripts deshabilitada. Lanza en Powershell:

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
Para más detalles, visita este enlace.

📊 Gestión de la Base de Datos con HeidiSQL
Descomprime el archivo de HeidiSQL y ejecuta heidisql.exe. Puedes usarlo para conectarte a la base de datos de desarrollo y realizar tareas como inspeccionar tablas, ejecutar consultas y depurar datos.