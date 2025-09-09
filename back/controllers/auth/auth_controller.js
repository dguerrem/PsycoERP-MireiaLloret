const bcrypt = require("bcrypt");
const {
  getUserByEmail,
  updateLastLogin,
  getUserById,
} = require("../../models/auth/auth_model");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son obligatorios",
      });
    }

    // Buscar el usuario por email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada",
      });
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Actualizar la fecha de último login
    await updateLastLogin(user.id);

    // Obtener la información actualizada del usuario
    const updatedUser = await getUserById(user.id);

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error en loginUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const hashPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Validar que se proporcione la contraseña
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "La contraseña es obligatoria",
      });
    }

    // Generar hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    res.status(200).json({
      success: true,
      message: "Contraseña encriptada exitosamente",
      data: {
        original_password: password,
        hashed_password: hashedPassword,
        salt_rounds: saltRounds,
        sql_query: `UPDATE users SET password_hash = '${hashedPassword}' WHERE email = 'tu-email@ejemplo.com';`
      },
    });
  } catch (error) {
    console.error("Error al encriptar contraseña:", error.message);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  loginUser,
  hashPassword,
};