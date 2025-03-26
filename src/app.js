import express from "express";
import cors from "cors";
import pkg from "express-validator";
const { body, query, ExpressValidator, ValidationChain } = pkg;
import appRoutes from "./routes/function.routes.js";

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api", appRoutes);

app.use((req, res, next) => {
  console.log("Petición a ruta no encontrada");
  res.status(404).json({"msg":"Petición a ruta no encontrada"});
});

export default app;
