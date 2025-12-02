import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/authService";
import "./Loginform.css";
// import { FormProject } from "../../pages/gestion_proyectos/ProjectManagementPage";
import { useUser } from "../../context/UserContext";

const Loginform = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const loginGitHub = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "futureplan") {
      const adminUser = {
        id: 0,
        nombre: "Admin",
        apellido: "",
        correo: email,
        rol: "Administrador",
      };
      localStorage.setItem("usuario", JSON.stringify(adminUser));

      // AQUÍ DEBERÍAS ACTUALIZAR EL CONTEXTO TAMBIÉN (veremos esto luego)

      navigate("/gest_user");
      return;
    }

    const data = await loginService(email, password);

    if (data.mensaje === "Login exitoso") {
      login(data.usuario); // Actualizamos contexto

      if (data.usuario.rol === "Administrador") {
        navigate("/gest_user");
      } else {
        // CORRECCIÓN: Ahora redirige a /inicio
        navigate("/inicio");
      }
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div>
      <form className="formm" onSubmit={handleLogin}>
        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            viewBox="0 0 32 32"
            height="20"
          >
            <g data-name="Layer 3" id="Layer_3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
          <input
            placeholder="Ingresa tu Correo"
            className="input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            viewBox="-64 0 512 512"
            height="20"
          >
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
          </svg>
          <input
            placeholder="Ingresa tu Contraseña"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex-row">
          <div>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Recordarme</label>
          </div>
          <span className="span">¿Olvidaste tu contraseña?</span>
        </div>

        <button type="submit" className="button-submit">
          Sign In
        </button>

        {/* --- NUEVOS BOTONES DE LOGIN SOCIAL --- */}
        <div className="social-login">
          <p className="divider">o inicia sesión con</p>
          <div className="social-buttons">
            <button
              type="button"
              className="btn-google"
              onClick={() =>
                (window.location.href = "http://localhost:3000/auth/google")
              }
            >
              <img src="/Images/google.png" alt="Google" className="icon" />
              Google
            </button>

            <button type="button" className="btn-github" onClick={loginGitHub}>
              <img src="/Images/github.png" alt="GitHub" className="icon" />
              GitHub
            </button>
          </div>
        </div>
        {/* --------------------------------------- */}

        <p className="p">
          ¿No tienes una cuenta?{" "}
          <span
            className="span"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Loginform;
