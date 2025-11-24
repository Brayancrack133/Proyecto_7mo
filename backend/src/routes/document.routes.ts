const { Router } = require("express");
const { upload } = require("../middlewares/upload.middleware");
const {
  uploadDocument,
  listDocuments,
  downloadDocument
} = require("../controllers/document.controller");

const router = Router();

// POST subir archivo
router.post("/upload", upload.single("file"), uploadDocument);

// GET listar documentos
router.get("/", listDocuments);

// ⬇⬇⬇ NUEVA RUTA REAL PARA DESCARGA ⬇⬇⬇
router.get("/:id/download", downloadDocument);

module.exports = router;
