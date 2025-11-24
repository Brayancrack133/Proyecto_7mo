const express = require("express");
const documentosRoutes = require("./routes/document.routes");

const app = express();
app.use(express.json());

app.use("/api/documentos", documentosRoutes);

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000 🚀"));
