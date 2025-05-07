/////IMPORTO EL VALIDATION RESULT
import { validationResult } from "express-validator";

////Función para generar una respuesta después de aplicar
////la validación de los datos, detecta si se recibe
////un error y lo devuelve al FE, sino, continua al
////controller

export function resultadoValidacion(req, res, next) {
  ///acá captura la rta de la validación
  const result = validationResult(req).array();
  //valido si el array contiene algo:
  if (!result.length) return next();
  console.log(result);
  ///si hay error lo envío como JSON
  const error = result[0].msg;
  res.status(400).json({ code: 400, message: error });
}
