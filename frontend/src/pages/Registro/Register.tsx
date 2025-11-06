import Registerform from "../../components/organisms/Registerform";
import "./Register.css"; // 👈 Importa los estilos

const Register = () => {
  return (
    <div className="register-container">
      <div className="animated-bg"></div> {/* Fondo animado */}
      <div className="register-overlay">
        <Registerform />
      </div>
    </div>
  );
};

export default Register;
