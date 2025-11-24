interface Usuario {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  ci: string;
  rol: string;
  estado: string;
}

interface TableProps {
  usuarios: Usuario[];
}

export default function UserTable({ usuarios }: TableProps) {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Cédula</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.direccion}</td>
                <td>{u.ci}</td>
                <td>{u.rol}</td>
                <td className="acciones">
                  <button className="ver">👁️</button>
                  <button className="editar">✏️</button>
                  <button className="eliminar">❌</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="no-data">
                No hay usuarios en esta categoría.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
