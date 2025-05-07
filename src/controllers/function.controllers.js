import { formatoRta } from "../scripts/formatoRta.js";
import { obtenerFechaYHoraActual } from "../scripts/fechaHoraActual.js";
import fs from "fs";
import util from "util";
import dayjs from "dayjs";
import "dayjs/locale/es.js";
import { MongoLib } from "../../lib/mongo.js";

////////////////////////////////
export const crearTrabajador = async (req, res) => {
  const {
    nombre,
    numeroDocumento,
    tipoDocumento,
    fechaExpedicionDocumento,
    email,
    dependencia,
  } = req.body;
  console.log("🚀 ~ crearTrabajador ~ numeroDocumento:", numeroDocumento);
  obtenerFechaYHoraActual();
  const db = new MongoLib();

  try {
    // Conectarse a la base de datos
    const database = await db.connect();
    const collection = database.collection("trabajadores");

    // Revisar si el trabajador ya existe
    const trabajadorExistente = await collection.findOne({ numeroDocumento });

    if (trabajadorExistente) {
      return res
        .status(400)
        .json(
          formatoRta(
            "",
            "",
            `El trabajador con documento ${numeroDocumento} ya está registrado.`
          )
        );
    }

    // Crear el nuevo trabajador
    const nuevoTrabajador = {
      nombre,
      numeroDocumento,
      tipoDocumento,
      fechaExpedicionDocumento,
      email,
      fechaRegistro: new Date(),
      dependencia,
    };

    const resultado = await collection.insertOne(nuevoTrabajador);

    if (resultado.insertedId) {
      res
        .status(201)
        .json(
          formatoRta(
            resultado.insertedId,
            "",
            "Trabajador registrado exitosamente"
          )
        );
    } else {
      res
        .status(500)
        .json(
          formatoRta(
            "",
            "",
            "Error al registrar el trabajador en la base de datos"
          )
        );
    }
  } catch (error) {
    console.error("Error en crearTrabajador:", error);
    res.status(500).json(formatoRta("", "", "" + error));
  } finally {
    await db.close();
  }
};

export const consTrabajador = async (req, res) => {
  console.log("consTrabajador, req.params =>", req.query);

  obtenerFechaYHoraActual();

  const { numeroDocumento } = req.query;
  console.log("🚀 92 ~ consTrabajador ~ numeroDocumento:", numeroDocumento);

  //en este parte ya se debe validar por el express-validator
  const db = new MongoLib();

  try {
    // Conectarse a la base de datos
    const database = await db.connect();
    const collection = database.collection("trabajadores");
    // Buscar el trabajador por número de documento
    const trabajador = await collection.findOne({ numeroDocumento });

    if (trabajador) {
      console.log("Trabajador encontrado:", trabajador);
      res.status(200).json(trabajador);
    } else {
      console.log("No se encontró el trabajador");
      res.status(404).json(formatoRta(404, "", "Trabajador no encontrado"));
    }
  } catch (error) {
    console.error("Error en consTrabajador:", error);
    res
      .status(500)
      .json(
        formatoRta(
          error.code,
          "",
          "Ocurrió un error en el servidor. Por favor, inténtelo de nuevo."
        )
      );
  } finally {
    await db.close();
  }
};

export const editarTrabajador = async (req, res) => {
  console.log("editTrabajador, req.body =>", req.body);
  const {
    Nombre,
    numeroDocumento,
    tipoDocumento,
    email,
    fechaExpedicionDocumento,
    dependencia,
  } = req.body;

  obtenerFechaYHoraActual();
  const fechaRegistro = new Date();

  const db = new MongoLib();

  try {
    // Conectar a la base de datos
    const database = await db.connect();
    const collection = database.collection("trabajadores");
    //consultar si el dato existe
    // Buscar el trabajador por número de documento
    const trabajador = await collection.findOne({ numeroDocumento });
    if (trabajador) {
      const result = await collection.updateOne(
        { numeroDocumento }, //---> para validar el registro que se va a actualizar
        {
          $set: {
            nombre,
            tipoDocumento,
            email,
            fechaRegistro,
            fechaExpedicionDocumento,
            dependencia,
          },
        }
      );
      console.log("🚀 ~ editarTrabajador ~ result:", result);

      if (result.matchedCount === 1) {
        console.log("Trabajador actualizado:", numeroDocumento);
        res
          .status(200)
          .json(
            formatoRta(
              "",
              "",
              `Trabajador con documento ${numeroDocumento} actualizado con éxito`
            )
          );
      } else {
        console.log("El registro no se actualizó correctamente");
        res.status(404).json(formatoRta("", "", "Trabajador no encontrado"));
      }
    } else {
      res.status(401).json(formatoRta("", "", "Trabajador no encontrado"));
    }
  } catch (error) {
    console.error("Error en editTrabajador:", error);
    res
      .status(500)
      .json(
        formatoRta(
          error.code,
          "",
          "Ocurrió un error en el servidor. Por favor, inténtelo de nuevo."
        )
      );
  } finally {
    await db.close();
  }
};

export const elimTrabajador = async (req, res) => {
  console.log("elimTrabajador, req.params =>", req.query);
  obtenerFechaYHoraActual();

  const { numeroDocumento } = req.query;

  if (!numeroDocumento) {
    return res
      .status(400)
      .json(formatoRta("", "", "No se recibió el número de documento"));
  }
  const db = new MongoLib();
  try {
    // Conectarse a la base de datos
    const database = await db.connect();
    const collection = database.collection("trabajadores");

    // Intentar eliminar el trabajador por número de documento
    const result = await collection.deleteOne({ numeroDocumento });

    if (result.deletedCount === 1) {
      console.log("Trabajador eliminado:", numeroDocumento);
      res
        .status(200)
        .json(
          formatoRta(
            "",
            "",
            `Trabajador con documento ${numeroDocumento} eliminado exitosamente`
          )
        );
    } else {
      console.log("Trabajador no encontrado para eliminación");
      res.status(404).json(formatoRta("", "", "Trabajador no encontrado"));
    }
  } catch (error) {
    console.error("Error en elimTrabajador:", error);
    res
      .status(500)
      .json(
        formatoRta(
          error.code,
          "",
          "Ocurrió un error en el servidor. Por favor, inténtelo de nuevo."
        )
      );
  } finally {
    await db.close();
  }
};

/* export const appCrear = async (req, res) => {
  console.log("Ingresé al controlador de crear");
  console.log(req.body);
  const data = req.body;
  res.status(404).json({ data });
};

///controlador para actualizar datos
export const appActualizar = async (req, res) => {
  console.log("Ingresé al controlador de actualización");
  console.log(req.body);
  res.status(200).json({"msg":req.body})
  
};

///controlador para consultar por método GET
export const appConsultar = async (req, res) => {
  console.log("Ingresé al controlador de consultas");
  const id = req.query.id;
  console.log("🚀 ~ appConsultar ~ id:", id);
  res.status(408).json({ id });
};
 */

export const bookingConnect = async (req, res) => {
  const response = req.body;
  console.log(response.components.schemas.Room.properties.type);

  res.status(200).json(formatoRta("", "", "This is the Booking API connect testing module"));
};
