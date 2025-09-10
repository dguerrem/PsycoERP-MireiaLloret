const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "psychology_erp_secret_key_2024";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
  } catch (error) {
    throw new Error(`Error al generar token: ${error.message}`);
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    } else {
      throw new Error(`Error al verificar token: ${error.message}`);
    }
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    throw new Error(`Error al decodificar token: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  JWT_SECRET,
  JWT_EXPIRATION,
};
