////IMPORTO LA LIBRERÍA DE CHECK PARA
//// VALIDAR DATOS
import { check } from "express-validator";

////VALIDO LOS DATOS DE LAS PETICIONES HTTP
export const validarBody = [
  check("numeroDocumento")
    .notEmpty()
    .withMessage("No se recibio la clave numeroDocumento")
    .toInt()
    .isNumeric()
    .withMessage("La clave numeroDocumento debe ser numérica"),
  check("Nombre").notEmpty().withMessage("No se recibió la clave nombre"),
  check("email")
    .notEmpty()
    .withMessage("No se recibió la clave email")
    .normalizeEmail()
    .isEmail()
    .withMessage("email no válido"),
  check("fechaExpedicionDocumento")
    .notEmpty()
    .withMessage("No se recibió la clave fechaExpedicionDocumento")
    .isISO8601()
    .withMessage("El formato fechaExpedicionDocumento no es válido"),
  check("dependencia")
    .notEmpty()
    .withMessage("No se recibió la clave dependencia"),
  check("tipoDocumento")
    .notEmpty()
    .withMessage("No se recibió la clave tipoDocumento"),
];

export const validarNumDocumento = [
  check("numeroDocumento")
    .notEmpty()
    .withMessage("El valor Número Documento debe ser numérico."),
];
