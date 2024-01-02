import React, { useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "../../styles/Administrador/DatosUsuario.css";
import Nestor from "../../assets/FotoNstor.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#root");

const DatosUsuario = () => {
  const [usuario, setUsuario] = useState({
    nombre: "Admin",
    apellido: "User",
    correo: "admin@example.com",
    contrasena: "password123",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (isEditable) {
      Swal.fire({
        title: "¿Estás seguro de editar estos datos?",
        showDenyButton: true,
        confirmButtonText: "Continuar",
        denyButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setUsuario(data);
          setIsEditable(false);
          toast.success("Datos actualizados exitosamente!");
          reset();
        }
      });
    } else {
      setIsEditable(true);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const onSubmitPassword = (data) => {
    // Logic to change password
  };

  return (
    <div className="datosUsuario">
      <div className="formUsuario">
      <h2>Usuario</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Nombre:
          <input
            type="text"
            {...register("nombre", { required: true })}
            defaultValue={usuario.nombre}
            disabled={!isEditable}
          />
          {errors.nombre && <p className="requerido">Este campo es requerido</p>}
        </label>
        <label>
          Apellido:
          <input
            type="text"
            {...register("apellido", { required: true })}
            defaultValue={usuario.apellido}
            disabled={!isEditable}
          />
          {errors.apellido && <p className="requerido">Este campo es requerido</p>}
        </label>
        <label>
          Correo:
          <input
            type="email"
            {...register("correo", { required: true })}
            defaultValue={usuario.correo}
            disabled={!isEditable}
          />
          {errors.correo && <p className="requerido">Este campo es requerido</p>}
        </label>
      </form>
      <button onClick={onSubmit}>{isEditable ? "Guardar" : "Editar"}</button>
      <button onClick={() => setModalIsOpen(true)}>Cambiar Contraseña</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <form onSubmit={handleSubmit(onSubmitPassword)}>
          <label>
            Contraseña Antigua:
            <br />
            <div className="passwordContainer">
              <input
                className="datosUsuario input modalInput passwordInput"
                type={showPassword ? "text" : "password"}
                {...register("oldPassword", { required: true })}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="passwordIcon"
              />
            </div>
            {errors.oldPassword && <p className="requerido">Este campo es requerido</p>}
          </label>
          <label>
          Nueva Contraseña:
            <br />
            <div className="passwordContainer">
              <input
                className="datosUsuario input modalInput passwordInput"
                type={showPassword ? "text" : "password"}
                {...register("newPassword", { required: true })}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="passwordIcon"
              />
            </div>
            {errors.newPassword && <p className="requerido">Este campo es requerido</p>}
          </label>
          <label>
          Confirmar Nueva Contraseña:
            <br />
            <div className="passwordContainer">
              <input
                className="datosUsuario input modalInput passwordInput"
                type={showPassword ? "text" : "password"}
                {...register("confirmNewPassword", { required: true })}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="passwordIcon"
              />
            </div>
            {errors.confirmNewPassword && <p className="requerido">Este campo es requerido</p>}
          </label>
          <button className="agregarBtn" type="submit">
            Cambiar Contraseña
          </button>
          <button className="cancelarBtn" onClick={() => setModalIsOpen(false)}>
            Cancelar
          </button>
        </form>
      </Modal>
      <ToastContainer />
      </div>

      <div className="perfilUsuario">
        <img src={Nestor} alt="Foto de perfil" />
      </div>
    </div>
  );
};

export default DatosUsuario;
