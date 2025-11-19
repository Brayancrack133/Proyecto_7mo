import Loginform from "../../components/organisms/Loginform";
import "./Login.css"; // 👈 agrega este import para los estilos

const Login = () => {
  return (
    <div className="login-container">
      <img className="Grupomain" src="/Images/Grupo.jpg" alt="Imagengrupal" />
      <div className="login-overlay">
        <Loginform />
      </div>
    </div>
  );
};

export default Login;
