const { db } = require("../config/db");

// Opcional: definir tipo para mejor autocompletado
// Pero si quieres rápido, dejamos `any` para evitar errores de TS
// type DocumentData = {
//   id_proyecto: number;
//   nombre_archivo: string;
//   url: string;
//   id_tipo_doc: number;
//   id_usuario_subida: number;
// };

const DocumentService = {
  // Se declara data como 'any' para que TypeScript no marque error
  async createDocument(data: any) {
    const sql = `
      INSERT INTO documentos 
      (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      data.id_proyecto,
      data.nombre_archivo,
      data.url,
      data.id_tipo_doc,
      data.id_usuario_subida,
    ]);

    return result;
  },

  async getAllDocuments() {
    console.log("➡ DocumentService.getAllDocuments() llamado");
    const [rows] = await db.query("SELECT * FROM documentos ORDER BY fecha_subida DESC");
    console.log(`➡ filas obtenidas: ${rows.length}`);
    return rows;
  },
};

module.exports = { DocumentService };
