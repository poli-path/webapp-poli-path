import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import '../../styles/Administrador/RecoverPasswordCard.css';
import Adminis from "../../assets/Adminis.jpg";
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader"; // Importa ClipLoader

const RecoverPasswordCard = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Crea un estado para el indicador de carga
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true); // Comienza la carga
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/recover-password/${data.email}`,
        {
          method: "GET",
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      Swal.fire({
        icon: 'info',
        title: '¡Revisa tu correo!',
        text: 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña',
        iconColor: 'limegreen',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate("/admin");
      });
      
    } catch (error) {
      Swal.fire(error.message, "Debe ser un correo con una cuenta habilitada", "error");
    }
    setIsLoading(false); // Termina la carga
  };

  return (
    <div className="recover-password-container">
      <form className="recover-password-form" onSubmit={handleSubmit(onSubmit)}>
        {!isLoading && <Link to="/admin" className="back-button">←</Link>}
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
        {isLoading ? (
          <div
            className="loading-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>Cargando...</span>

            <ClipLoader color="#3d8463" loading={isLoading} size={30} />
          </div>
        ) : (
          <button type="submit">Recuperar contraseña</button>
        )}
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
