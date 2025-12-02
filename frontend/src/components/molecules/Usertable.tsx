import { FaEdit, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import "./usertable.css";

interface Props {
  usuarios: any[];
  onView: (u: any) => void;
  onEdit: (u: any) => void;
  onToggle: (id: number) => void;
}

export default function UserTable({ usuarios, onView, onEdit, onToggle }: Props) {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => {
            const userId = u.id_usuario ?? u.id ?? u.idUser ?? u.id_user; // tolerante a varios nombres
            const foto = u.foto_url || u.foto || "/Images/User.png";

            return (
              <tr key={userId ?? Math.random()}>
                <td>
                  <img src={foto} alt="foto" className="user-photo" />
                </td>

                <td>{u.nombre} {u.apellido}</td>
                <td>{u.correo}</td>
                <td className={u.estado === 1 ? "estado-activo" : "estado-inactivo"}>
                  {u.estado === 1 ? "Habilitado" : "Deshabilitado"}
                </td>

                <td className="acciones">
                  <button className="ver" onClick={() => onView(u)}><FaEye /></button>
                  <button className="editar" onClick={() => onEdit(u)}><FaEdit /></button>

                  {/* pasamos userId en vez de u.id_usuario */}
                  <button
                    onClick={() => {
                      if (userId === undefined || userId === null) {
                        console.warn("UserTable: id indefinido para usuario", u);
                        return;
                      }
                      onToggle(userId);
                    }}
                    className={u.estado === 1 ? "desactivar" : "activar"}
                  >
                    {u.estado === 1 ? <FaTimes /> : <FaCheck />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
