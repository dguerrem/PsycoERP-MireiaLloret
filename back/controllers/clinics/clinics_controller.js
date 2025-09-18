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
    const { name, clinic_color, address, price, percentage } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de clínica inválido",
      });
    }

    const data = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          error: "El nombre debe ser un texto válido y no puede estar vacío",
        });
      }
      data.name = name.trim();
    }

    if (clinic_color !== undefined) {
      if (typeof clinic_color !== 'string' || clinic_color.trim() === '') {
        return res.status(400).json({
          success: false,
          error: "El color debe ser un texto válido y no puede estar vacío",
        });
      }
      data.clinic_color = clinic_color.trim();
    }

    if (address !== undefined) {
      data.address = address === null ? null : (address ? address.trim() : null);
    }

    if (price !== undefined) {
      if (price === null) {
        data.price = null;
      } else {
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({
            success: false,
            error: "El precio debe ser un número válido mayor o igual a 0",
          });
        }
        data.price = priceNum;
      }
    }

    if (percentage !== undefined) {
      if (percentage === null) {
        data.percentage = null;
      } else {
        const percentageNum = parseFloat(percentage);
        if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
          return res.status(400).json({
            success: false,
            error: "El porcentaje debe ser un número válido entre 0 y 100",
          });
        }
        data.percentage = percentageNum;
      }
    }

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
    const { name, clinic_color, address, price, percentage } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "El nombre de la clínica es requerido",
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
      clinic_color: clinic_color.trim()
    };

    if (address !== undefined && address !== null) {
      data.address = address.trim();
    }

    if (price !== undefined && price !== null) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          success: false,
          error: "El precio debe ser un número válido mayor o igual a 0",
        });
      }
      data.price = priceNum;
    }

    if (percentage !== undefined && percentage !== null) {
      const percentageNum = parseFloat(percentage);
      if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
        return res.status(400).json({
          success: false,
          error: "El porcentaje debe ser un número válido entre 0 y 100",
        });
      }
      data.percentage = percentageNum;
    }

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