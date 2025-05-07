import { Router } from "express";
import {
  crearTrabajador,
  consTrabajador,
  editarTrabajador,
  elimTrabajador,
  bookingConnect,
} from "../controllers/function.controllers.js";
import { resultadoValidacion } from "../../helpers/validateHelper.js";
import {
  validarBody,
  validarNumDocumento,
} from "../../middleware/validation/validation.js";

const router = Router();
router.post("/crear", validarBody, resultadoValidacion, crearTrabajador);
router.put("/actualizar", validarBody, resultadoValidacion, editarTrabajador);
router.get(
  "/consultar",
  validarNumDocumento,
  resultadoValidacion,
  consTrabajador
);
router.delete(
  "/eliminar",
  validarNumDocumento,
  resultadoValidacion,
  elimTrabajador
);
router.post("/openapi", bookingConnect);
export default router;
