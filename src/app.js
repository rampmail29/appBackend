import express from "express";
import cors from "cors";
import pkg from "express-validator";
const { body, query, ExpressValidator, ValidationChain } = pkg;
import appRoutes from "./routes/function.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:8081", "http://127.0.0.1:5501/index.html", "https://appbackend-production-96c6.up.railway.app", "*"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors()); // Habilitar preflight para todas las rutas

app.use("/api", appRoutes);

app.use((req, res, next) => {
  console.log(req)
  console.log("Petición a ruta no encontrada");
  res.status(404).json({ msg: "Petición a ruta no encontrada" });
});

export default app;
