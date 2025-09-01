const {
  getClinics,
  updateClinic,
} = require("../../models/clinics/clinics_model");

const obtenerClinicas = async (req, res) => {
  try {
    const {
      name,
    } = req.query;

    const filters = {};
    if (name) filters.name = name;

    const clinicas = await getClinics(filters);

    res.json({
      success: true,
      total: clinicas.length,
      data: clinicas,
    });
  } catch (err) {
    console.error("Error al obtener clínicas:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las clínicas",
    });
  }
};

const actualizarClinica = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, clinic_color } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de clínica inválido",
      });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (address !== undefined) data.address = address;
    if (clinic_color !== undefined) data.clinic_color = clinic_color;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron datos para actualizar",
      });
    }

    await updateClinic(id, data);

    res.json({
      success: true,
      message: "Clínica actualizada exitosamente",
    });
  } catch (err) {
    console.error("Error al actualizar clínica:", err.message);
    
    if (err.message === "Clinic not found") {
      return res.status(404).json({
        success: false,
        error: "Clínica no encontrada",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error al actualizar la clínica",
    });
  }
};

module.exports = {
  obtenerClinicas,
  actualizarClinica,
};