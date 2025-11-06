import "./Registerform.css";
const Registerform = () => {
  return (
    <div>
      <form className="form">
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>
        
        <div className="flex">
          <label>
            <input className="input" type="text" placeholder="" required />
            <span>Nombre</span>
          </label>

          <label>
            <input className="input" type="text" placeholder="" required />
            <span>Apellido</span>
          </label>
        </div>  
            
        <label>
          <input className="input" type="email" placeholder="" required />
          <span>Email</span>
        </label> 
        
        <label>
          <input className="input" type="password" placeholder="" required />
          <span>Password</span>
        </label>
        
        <label>
          <input className="input" type="password" placeholder="" required />
          <span>Confirm password</span>
        </label>
        
        <button type="submit" className="submit">Submit</button>
        
        <p className="signin">
          Ya tienes una contrasena? <a href="#">Enviar</a>
        </p>
      </form>
    </div>
  )
}

export default Registerform