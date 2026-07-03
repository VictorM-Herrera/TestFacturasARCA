import express from "express";
import facturaController from "../controllers/factura.controller.js";

const router = express.Router();

router.post("/", facturaController.crearFacturaB);
router.get("/ultimo", facturaController.obtenerUltimaFactura);
// router.get("/:id", facturaController.obtenerFacturaPorId); //NO ESTA CREADO

export default router;