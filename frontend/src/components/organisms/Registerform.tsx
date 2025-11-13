import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registerform.css";

const Registerform = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Simular registro (guardado en localStorage)
    const nuevoUsuario = { nombre, apellido, email, password };
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));

    alert("Usuario registrado correctamente");
    navigate("/");
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
