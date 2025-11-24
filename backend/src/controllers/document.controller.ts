// document.controller.ts
const { DocumentService } = require("../services/document.service");

const uploadDocument = async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { id_proyecto, id_tipo_doc, id_usuario_subida } = req.body;

    const documentData = {
      id_proyecto,
      id_tipo_doc,
      id_usuario_subida,
      nombre_archivo: req.file.originalname,
      url: req.file.location, // URL pública S3
    };

    await DocumentService.createDocument(documentData);

    res.json({ message: "Documento subido correctamente", data: documentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir documento" });
  }
};
const downloadDocument = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Obtener documento desde BD
    const docs = await DocumentService.getAllDocuments();
    const doc = docs.find((d: any) => d.id === Number(id));

    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });

    // Devolver la URL pública de S3 (archivo ya está en Amazon)
    return res.json({
      message: "OK",
      url: doc.url,
    });

  } catch (error) {
    console.error("Error al descargar documento:", error);
    return res.status(500).json({ message: "Error al descargar documento" });
  }
};
const listDocuments = async (req: any, res: any) => {
  try {
    const docs = await DocumentService.getAllDocuments();
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener documentos" });
  }
};

module.exports = { uploadDocument, listDocuments, downloadDocument  };
