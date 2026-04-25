import express from "express";
import { crearFacturaB } from "../services/factura.service.js";

const router = express.Router();

router.post("/facturar", async (req, res) => {
  try {
    const result = await crearFacturaB();

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.log(error.response?.data || error);

    res.status(500).json({
      ok: false,
      error: error.response?.data || error.message,
    });
  }
});

export default router;