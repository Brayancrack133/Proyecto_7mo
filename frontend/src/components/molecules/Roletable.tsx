import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function RoleTable({ roles, onEdit, onDelete }: any) {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((r: { id_rol: Key | null | undefined; nombre_rol: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
            <tr key={r.id_rol}>
              <td>{r.nombre_rol}</td>

              <td>
                <button className="editar" onClick={() => onEdit(r)}><FaEdit /></button>
                <button className="eliminar" onClick={() => onDelete(r.id_rol)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
