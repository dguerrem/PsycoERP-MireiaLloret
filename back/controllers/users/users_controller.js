const {
  getUserById,
} = require("../../models/users/users_model");

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que se proporcione el ID y sea un número válido
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID es requerido y debe ser un número válido",
        message: "Debe proporcionar un ID de usuario válido"
      });
    }

    const user = await getUserById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
        message: "El usuario especificado no existe o no está activo"
      });
    }

    res.json({
      success: true,
      data: user,
      message: "Usuario obtenido exitosamente"
    });
  } catch (err) {
    console.error("Error al obtener usuario:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener el usuario",
      message: "Ha ocurrido un error interno del servidor"
    });
  }
};

module.exports = {
  obtenerUsuarioPorId,
};