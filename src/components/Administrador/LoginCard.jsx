import React from "react";
import "../../styles/Administrador/LoginCard.css";
import Adminis from "../../assets/Adminis.jpg";
import { Link } from "react-router-dom";

const LoginCard = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Iniciar sesión como Administrador</h2>
        <p>
          Esta sección es exclusiva para los administradores de la aplicación
        </p>
        <div className="input-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <div className="forgot-password">
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>
        <Link to="/administrador">
          <button type="submit">Iniciar sesión</button>
        </Link>
      </form>
      <div className="image-container">
        <img
          src={Adminis} // URL de tu imagen
          alt="Imagen"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default LoginCard;
