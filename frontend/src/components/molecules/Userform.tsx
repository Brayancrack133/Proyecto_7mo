interface Props {
  modo: "agregar" | "editar" | "ver";
  roles: any[];
  usuario: any | null;
  onSubmit: (data: any) => void;
}

export default function UserForm({ modo, roles, usuario, onSubmit }: Props) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();

      const form = e.currentTarget;
      const data = new FormData(form);

      onSubmit({
        nombre: data.get("nombre"),
        apellido: data.get("apellido"),
        correo: data.get("correo"),
        contraseña: data.get("contraseña"),
        id_rol: Number(data.get("id_rol")),
      });
    }}>

      <div className="form-grid">
        <label>Nombre
          <input name="nombre" defaultValue={usuario?.nombre} readOnly={modo==="ver"} required />
        </label>

        <label>Apellido
          <input name="apellido" defaultValue={usuario?.apellido} readOnly={modo==="ver"} required />
        </label>

        <label>Correo
          <input name="correo" defaultValue={usuario?.correo} readOnly={modo==="ver"} required />
        </label>

        {modo === "agregar" && (
          <label>Contraseña
            <input name="contraseña" type="password" required />
          </label>
        )}

        <label>Rol
          <select name="id_rol" defaultValue={usuario?.id_rol} disabled={modo==="ver"} required>
            {roles.map((r) => (
              <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>
            ))}
          </select>
        </label>
      </div>

      {modo !== "ver" && (
        <div className="modal-actions">
          <button className="btn agregar" type="submit">
            {modo === "agregar" ? "Crear Usuario" : "Guardar Cambios"}
          </button>
        </div>
      )}

    </form>
  );
}
