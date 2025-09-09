const { verifyToken } = require("../utils/jwt");
const { getUserById } = require("../models/auth/auth_model");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    // Verificar el token
    const decoded = verifyToken(token);

    // Verificar que el usuario existe y está activo
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("Error en authenticateToken:", error.message);
    
    if (error.message === "Token expirado") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        error: "TOKEN_EXPIRED",
      });
    }

    if (error.message === "Token inválido") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
        error: "INVALID_TOKEN",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);

    req.user = user ? {
      id: user.id,
      email: user.email,
      name: user.name,
    } : null;

    next();
  } catch (error) {
    // En auth opcional, ignoramos errores de token y continuamos sin usuario
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};