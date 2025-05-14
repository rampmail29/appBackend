import { formatoRta } from "../scripts/formatoRta.js";
import { obtenerFechaYHoraActual } from "../scripts/fechaHoraActual.js";
//import { ObjectId } from "mongodb";
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
  console.log("consTrabajador, req.query =>", req.query);

  const { numeroDocumento } = req.query;
  const db = new MongoLib();

  try {
    const database = await db.connect();
    const collection = database.collection("trabajadores");

    if (numeroDocumento) {
      // Buscar un solo trabajador por número de documento
      const trabajador = await collection.findOne({ numeroDocumento });

      if (trabajador) {
        console.log("Trabajador encontrado:", trabajador);
        res.status(200).json(trabajador);
      } else {
        console.log("No se encontró el trabajador");
        res.status(404).json(formatoRta(404, "", "Trabajador no encontrado"));
      }
    } else {
      // Si no hay número de documento, retornar todos los trabajadores
      const trabajadores = await collection.find({}).toArray();

      if (trabajadores.length > 0) {
        console.log("Trabajadores encontrados:", trabajadores.length);
        res.status(200).json(trabajadores);
      } else {
        console.log("No hay trabajadores registrados");
        res.status(200).json([]); // retorna arreglo vacío si no hay resultados
      }
    }
  } catch (error) {
    console.error("Error en consTrabajador:", error);
    res
      .status(500)
      .json(
        formatoRta(
          error.code || 500,
          "",
          "Ocurrió un error en el servidor. Por favor, inténtelo de nuevo."
        )
      );
  } finally {
    await db.close();
  }
};

export const editarTrabajador = async (req, res) => {
  console.log("editarTrabajador → req.body:", req.body);
  console.log("editarTrabajador → req.params:", req.params);

  const { numeroDocumento } = req.params;
  const {
    nombre,
    tipoDocumento,
    email,
    fechaExpedicionDocumento,
    dependencia,
  } = req.body;

  const fechaRegistro = new Date();
  const db = new MongoLib();

  try {
    const database = await db.connect();
    const collection = database.collection("trabajadores");

    // Buscar si el trabajador existe
    const trabajador = await collection.findOne({ numeroDocumento });

    if (!trabajador) {
      return res.status(404).json(formatoRta(404, "", "Trabajador no encontrado"));
    }

    const result = await collection.updateOne(
      { numeroDocumento },
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

    console.log("Resultado de actualización:", result);

    if (result.modifiedCount === 1 || result.matchedCount === 1) {
      return res.status(200).json(
        formatoRta(
          "",
          "",
          `Trabajador con documento ${numeroDocumento} actualizado con éxito`
        )
      );
    } else {
      return res.status(500).json(formatoRta("", "", "No se pudo actualizar el trabajador"));
    }
  } catch (error) {
    console.error("Error en editarTrabajador:", error);
    return res.status(500).json(
      formatoRta(
        error.code || 500,
        "",
        "Ocurrió un error en el servidor. Por favor, inténtelo de nuevo."
      )
    );
  } finally {
    await db.close();
  }
};


export const elimTrabajador = async (req, res) => {
  console.log("elimTrabajador, req.query =>", req.query);
  obtenerFechaYHoraActual();

  const { numeroDocumento } = req.query;

  if (!numeroDocumento) {
    return res
      .status(400)
      .json(formatoRta("", "", "No se recibió el número de documento del trabajador."));
  }

  const db = new MongoLib();

  try {
    const database = await db.connect();
    const collection = database.collection("trabajadores");

    const result = await collection.deleteOne({ numeroDocumento });

    if (result.deletedCount === 1) {
      console.log("Trabajador eliminado con número de documento:", numeroDocumento);
      return res
        .status(200)
        .json(formatoRta("", "", `Trabajador con número de documento ${numeroDocumento} eliminado exitosamente.`));
    } else {
      console.log("Trabajador no encontrado para eliminación:", numeroDocumento);
      return res
        .status(404)
        .json(formatoRta("", "", "Trabajador no encontrado."));
    }
  } catch (error) {
    console.error("Error en elimTrabajador:", error);
    return res.status(500).json(
      formatoRta(
        error.code || "",
        "",
        "Ocurrió un error interno del servidor. Por favor, inténtelo de nuevo."
      )
    );
  } finally {
    await db.close();
  }
};

export const bookingConnect = async (req, res) => {
  const response = req.body;
  console.log(response.components.schemas.Room.properties.type);

  res
    .status(200)
    .json(formatoRta("", "", "This is the Booking API connect testing module"));
};
