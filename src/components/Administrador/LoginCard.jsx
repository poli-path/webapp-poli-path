import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "../../styles/Administrador/LoginCard.css";
import Adminis from "../../assets/Adminis.jpg";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Importa ClipLoader
import Cookies from "js-cookie";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Crea un estado para el indicador de carga
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true); // Comienza la carga
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // Almacena todos los datos de responseData en las cookies
      Object.keys(responseData).forEach((key) => {
        Cookies.set(key, responseData[key], { expires: 1.5 / 24 }); // La cookie expira después de 1 hora
      });

      if (responseData.roles.includes("admin")) {
        navigate("/administrador");
      } else {
        Swal.fire(
          "No tienes permiso para iniciar sesión como Administrador",
          "Solo usuarios con el rol de administrador pueden entrar a esta sección",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(error.message, "Intenta de nuevo", "error");
    }
    setIsLoading(false); // Termina la carga
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Iniciar sesión como Administrador</h2>
        <p>
          Esta sección es exclusiva para los administradores de la aplicación
        </p>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Ingresa tu Email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="requerido">Este campo es requerido</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <div className="passwordContainer">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              {...register("password", { required: true })}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="passwordIcon"
            />
          </div>

          {errors.password && (
            <span className="requerido">Este campo es requerido</span>
          )}
        </div>

        {!isLoading && (
          <div className="forgot-password">
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </div>
        )}
        {isLoading ? (
          <div
            className="loading-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>Verificando tu sesión...</span>

            <ClipLoader color="#3d8463" loading={isLoading} size={30} />
          </div>
        ) : (
          <button type="submit">Iniciar sesión</button>
        )}
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
