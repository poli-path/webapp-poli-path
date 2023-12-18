import React from 'react';
import '../../styles/Administrador/RecoverPasswordCard.css';
import Adminis from "../../assets/Adminis.jpg";
import { Link } from 'react-router-dom';

const RecoverPasswordCard = () => {
  return (
    <div className="recover-password-container">
      <form className="recover-password-form">
      <Link to="/admin" className="back-button">←</Link>
        <h2>Recuperar contraseña</h2>
        <p>Por favor, ingresa tu correo electrónico para recuperar tu contraseña</p>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input type="email" id="email" name="email" placeholder="Ingresa tu correo electrónico" />
        </div>
        <button type="submit">Recuperar contraseña</button>
      </form>
      <div className="image-container">
        <img
          src={Adminis} // URL de tu imagen
          alt="Imagen"
          className="recover-password-image"
        />
      </div>
    </div>
  );
}

export default RecoverPasswordCard;
