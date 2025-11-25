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
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>
                <img src="/Images/User.png" className="user-photo" />
              </td>

              <td>{u.nombre} {u.apellido}</td>

              <td>{u.correo}</td>

              

              <td>{u.estado === 1 ? "Habilitado" : "Deshabilitado"}</td>

              <td className="acciones">
                <button className="ver" onClick={() => onView(u)}><FaEye /></button>
                <button className="editar" onClick={() => onEdit(u)}><FaEdit /></button>
                <button onClick={() => onToggle(u.id_usuario)}>
                  {u.estado === 1 ? <FaTimes /> : <FaCheck />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
