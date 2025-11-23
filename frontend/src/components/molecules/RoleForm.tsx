export default function RoleForm({ modo, rol, onSubmit }: any) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);

      onSubmit({
        nombre_rol: data.get("nombre_rol")
      });
    }}>

      <label>Nombre del Rol
        <input name="nombre_rol" defaultValue={rol?.nombre_rol} required />
      </label>

      <div className="modal-actions">
        <button className="btn agregar" type="submit">
          {modo === "agregar" ? "Crear Rol" : "Guardar Cambios"}
        </button>
      </div>

    </form>
  );
}
