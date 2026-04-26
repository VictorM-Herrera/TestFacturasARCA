import facturaService from "../services/factura.service.js";


const facturaController = {};

facturaController.crearFacturaB = async (req, res) => {
  try {
    const result = await facturaService.crearFacturaB(req.body);

    res.status(201).json({
      ok: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

facturaController.obtenerUltimaFactura = async (req, res) => {
  try {
    const result = await facturaService.obtenerUltimaFactura(req.query);

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

export default facturaController;
