import { Router } from "express";
import {
  appCrear,
  appActualizar,
  appConsultar,
} from "../controllers/function.controllers.js";

const router = Router();
router.post("/crear", appCrear);
router.put("/actualizar", appActualizar);
router.get("/consultar", appConsultar);
export default router;
