import Registerform from "../../components/organisms/Registerform";
import "./Register.css"; 

const Register = () => {
  return (
    <div className="register-container">
      <img className="Gruporegister" src="/Images/teams.jpg" alt="Imagengrupal" />
      <div className="register-overlay">
        <Registerform />
      </div>
      <div className="logo-container">
    <img className="imglogo" src="/Images/LogoF.png" alt="Imagen 3D" />
  </div>
    </div>
  );
};

export default Register;
