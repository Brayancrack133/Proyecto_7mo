import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerService } from "../../services/authService";
import "./Registerform.css";

const Registerform = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  const data = await registerService({
    nombre,
    apellido,
    correo: email,
    contraseña: password,
  });

  if (data.mensaje === "Usuario registrado correctamente") {
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    navigate("/");
  } else {
    alert(data.mensaje || "Error en el registro");
  }
};

  return (
    <div>
      <form className="form" onSubmit={handleRegister}>
        <p className="title">Registrar</p>
        <p className="message">Logeate ahora y obten el acceso total a FuturePlan.</p>

        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <span>Nombre</span>
          </label>

          <label>
            <input
              className="input"
              type="text"
              required
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            <span>Apellido</span>
          </label>
        </div>

        <label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>

        <label>
          <input
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <label>
          <input className="input" type="password" required />
          <span>Confirm password</span>
        </label>

        <button type="submit" className="submit">Enviar</button>

        <p className="signin">
          Ya tienes una contraseña?{" "}
          <a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Login</a>
        </p>
      </form>
    </div>
  );
};

export default Registerform;
