const {
  getClinics,
  getDeletedClinics,
  createClinic,
  updateClinic,
  deleteClinic,
} = require("../../models/clinics/clinics_model");

const obtenerClinicas = async (req, res) => {
  try {
    const {
      name,
      page,
      limit,
    } = req.query;

    // Construir filtros incluyendo paginación
    const filters = {};
    if (name) filters.name = name;
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    const result = await getClinics(filters);

    res.json({
      success: true,
      pagination: result.pagination,
      data: result.data,
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

const eliminarClinica = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de clínica inválido",
      });
    }

    const eliminada = await deleteClinic(id);

    if (!eliminada) {
      return res.status(404).json({
        success: false,
        error: "Clínica no encontrada o ya está eliminada",
      });
    }

    res.json({
      success: true,
      message: "Clínica eliminada correctamente",
    });
  } catch (err) {
    console.error("Error al eliminar clínica:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al eliminar la clínica",
    });
  }
};

const obtenerClinicasEliminadas = async (req, res) => {
  try {
    const {
      name,
      page,
      limit,
    } = req.query;

    // Construir filtros incluyendo paginación
    const filters = {};
    if (name) filters.name = name;
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    const result = await getDeletedClinics(filters);

    res.json({
      success: true,
      pagination: result.pagination,
      data: result.data,
    });
  } catch (err) {
    console.error("Error al obtener clínicas eliminadas:", err.message);
    res.status(500).json({
      success: false,
      error: "Error al obtener las clínicas eliminadas",
    });
  }
};

const crearClinica = async (req, res) => {
  try {
    const { name, address, clinic_color } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "El nombre de la clínica es requerido",
      });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "La dirección de la clínica es requerida",
      });
    }

    if (!clinic_color || clinic_color.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "El color de la clínica es requerido",
      });
    }

    const data = { 
      name: name.trim(),
      address: address.trim(),
      clinic_color: clinic_color.trim()
    };

    const nuevaClinica = await createClinic(data);

    res.status(201).json({
      success: true,
      message: "Clínica creada exitosamente",
      data: nuevaClinica,
    });
  } catch (err) {
    console.error("Error al crear clínica:", err.message);
    
    if (err.message === "Name is required") {
      return res.status(400).json({
        success: false,
        error: "El nombre de la clínica es requerido",
      });
    }

    if (err.message === "Address is required") {
      return res.status(400).json({
        success: false,
        error: "La dirección de la clínica es requerida",
      });
    }

    if (err.message === "Clinic color is required") {
      return res.status(400).json({
        success: false,
        error: "El color de la clínica es requerido",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error al crear la clínica",
    });
  }
};

module.exports = {
  obtenerClinicas,
  obtenerClinicasEliminadas,
  crearClinica,
  actualizarClinica,
  eliminarClinica,
};