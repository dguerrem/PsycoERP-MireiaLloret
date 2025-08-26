# 💻 Backend del Proyecto

Guía rápida para poner en marcha el backend.

## 🚀 Stack Tecnológico

| Tecnología | Descripción |
|------------|-------------|
| **Node.js** | Entorno de ejecución de JavaScript. |
| **Express** | Framework web para crear la API REST. |
| **Nodemon** | Reinicia el servidor automáticamente. |
| **MariaDB** | Base de datos relacional. |

## 🛠️ Puesta en Marcha

### 1. Requisitos del sistema

Asegúrate de tener instalados los siguientes componentes:

- **Node.js 20.13.1**: [Descarga aquí](https://nodejs.org/download/release/v20.13.1/node-v20.13.1-x64.msi). Verifica la instalación con `node -v`.
- **HeidiSQL (Portable)**: Para gestionar la base de datos. [Descarga aquí](https://www.heidisql.com/downloads/releases/HeidiSQL_12.11_64_Portable.zip).

### 2. Configuración del archivo .env (PASO CRÍTICO):
1. Crea un archivo llamado .env en la raíz del proyecto

2. **IMPORTANTE**: Este archivo contiene credenciales sensibles y nunca debe ser pusheado al repositorio

3. Para obtener las credenciales correctas (host, usuario, contraseña, etc.), contacta directamente con DatabaseMaster

4. El archivo .env debe tener la siguiente estructura:

```
# Configuración de la base de datos
DB_HOST=tu_host_aqui
DB_USER=tu_usuario_aqui
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=nombre_de_la_base_de_datos
DB_PORT=3306

# Puerto del servidor
PORT=3000

# Otras configuraciones (si aplican)
NODE_ENV=development
```

### 3. Configuración del proyecto

1. Abre tu terminal y navega hasta la carpeta del proyecto.

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicia el servidor en modo de desarrollo:
   ```bash
   nodemon app.js
   ```

## 🚨 Solución de Problemas (Windows)

Si encuentras el error de política de ejecución en PowerShell:

```
nodemon : No se puede cargar el archivo...
```

Esto sucede porque PowerShell tiene la ejecución de scripts deshabilitada. Lanza en Powershell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Para más detalles, visita [este enlace](https://www.cdmon.com/es/blog/la-ejecucion-de-scripts-esta-deshabilitada-en-este-sistema-te-contamos-como-actuar).

## 📊 Gestión de la Base de Datos con HeidiSQL

Descomprime el archivo de HeidiSQL y ejecuta `heidisql.exe`. Puedes usarlo para conectarte a la base de datos de desarrollo y realizar tareas como inspeccionar tablas, ejecutar consultas y depurar datos.
