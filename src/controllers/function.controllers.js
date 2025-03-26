export const appCrear = async (req, res) => {
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
