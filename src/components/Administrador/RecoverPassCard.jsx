import React from 'react';
import { useForm } from 'react-hook-form';
import '../../styles/Administrador/RecoverPasswordCard.css';
import Adminis from "../../assets/Adminis.jpg";
import { Link } from 'react-router-dom';

const RecoverPasswordCard = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    // Aquí puedes agregar más validaciones o proceder con la recuperación de la contraseña
    console.log("Recuperando contraseña...");
  };

  return (
    <div className="recover-password-container">
      <form className="recover-password-form" onSubmit={handleSubmit(onSubmit)}>
        <Link to="/admin" className="back-button">←</Link>
        <h2>Recuperar contraseña</h2>
        <p>Por favor, ingresa tu correo electrónico para recuperar tu contraseña</p>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            {...register("email", { required: true })}
          />
          {errors.email && <span className='requerido'>Este campo es requerido</span>}
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
