import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "../../styles/Administrador/DatosUsuario.css";
import Nestor from "../../assets/Default.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

Modal.setAppElement("#root");

const DatosUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const userId = Cookies.get("id");
  const token = Cookies.get("token");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = response.data;
        setUsuario({
          nombre: data.name,
          apellido: data.lastname,
          contrasena: "",
          imagen: data.imageUrl || Nestor,
        });
  
        // Establece los valores iniciales de los campos de entrada
        setValue("nombre", data.name);
        setValue("apellido", data.lastname);
        setValue("imagen", data.imageUrl || Nestor);

  
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    getUserData();
  }, []);
  

  const onSubmit = async (data) => {
    if (isEditable) {
      Swal.fire({
        title: "¿Estás seguro de editar estos datos?",
        showDenyButton: true,
        confirmButtonText: "Continuar",
        denyButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.patch(
              `${process.env.REACT_APP_API_URL}/users/${userId}`,
              {
                name: data.nombre,
                lastname: data.apellido,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.status === 200) {
              setUsuario(data);
              setIsEditable(false);
              toast.success("Datos actualizados exitosamente!");
            } else {
              throw new Error("Error al actualizar los datos");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
      });
    } else {
      setIsEditable(true);
    }
  };

  if (isLoading) {
    return (
      <div className="datosUsuario">
        <div style={{ fontSize: "5vw" }}>Cargando...</div>
        <ClipLoader color="#3d8463" loading={isLoading} size={"20vw"} />
      </div>
    );
  }

  return (
    <div className="datosUsuario">
      <div className="formUsuario">
        <h2>Usuario</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Nombre:
            <input
              type="text"
              {...register("nombre", {
                required: isEditable,
                minLength: isEditable ? 3 : undefined,
                pattern: isEditable ? /^[^\s]+$/ : undefined,
              })}
              
              disabled={!isEditable}
            />
            {errors.nombre && (
              <p className="requerido">
                {isEditable
                  ? "Este campo es requerido y debe tener al menos 3 caracteres sin espacios"
                  : ""}
              </p>
            )}
          </label>
          <label>
            Apellido:
            <input
              type="text"
              {...register("apellido", {
                required: isEditable,
                minLength: isEditable ? 3 : undefined,
                pattern: isEditable ? /^[^\s]+$/ : undefined,
              })}
              
              disabled={!isEditable}
            />
            {errors.apellido && (
              <p className="requerido">
                {isEditable
                  ? "Este campo es requerido y debe tener al menos 3 caracteres sin espacios"
                  : ""}
              </p>
            )}
          </label>
        </form>

        <button onClick={handleSubmit(onSubmit)}>
          {isEditable ? "Guardar" : "Editar"}
        </button>
        <button onClick={() => setModalIsOpen(true)}>Cambiar Contraseña</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="modalContent"
          overlayClassName="modalOverlay"
        ></Modal>
        <ToastContainer />
      </div>

      <div className="perfilUsuario">
        <img src={usuario.imagen} alt="Foto de perfil" />
      </div>
    </div>
  );
};

export default DatosUsuario;

// <form onSubmit={handleSubmit(onSubmitPassword)}>
// <label>
//   Contraseña Antigua:
//   <br />
//   <div className="passwordContainer">
//     <input
//       className="datosUsuario input modalInput passwordInput"
//       type={showPassword ? "text" : "password"}
//       {...register("oldPassword", { required: true })}
//     />
//     <FontAwesomeIcon
//       icon={showPassword ? faEyeSlash : faEye}
//       onClick={() => setShowPassword(!showPassword)}
//       className="passwordIcon"
//     />
//   </div>
//   {errors.oldPassword && <p className="requerido">Este campo es requerido</p>}
// </label>
// <label>
//   Nueva Contraseña:
//   <br />
//   <div className="passwordContainer">
//     <input
//       className="datosUsuario input modalInput passwordInput"
//       type={showPassword ? "text" : "password"}
//       {...register("newPassword", { required: true })}
//     />
//     <FontAwesomeIcon
//       icon={showPassword ? faEyeSlash : faEye}
//       onClick={() => setShowPassword(!showPassword)}
//       className="passwordIcon"
//     />
//   </div>
//   {errors.newPassword && <p className="requerido">Este campo es requerido</p>}
// </label>
// <label>
//   Confirmar Nueva Contraseña:
//   <br />
//   <div className="passwordContainer">
//     <input
//       className="datosUsuario input modalInput passwordInput"
//       type={showPassword ? "text" : "password"}
//       {...register("confirmNewPassword", { required: true })}
//     />
//     <FontAwesomeIcon
//       icon={showPassword ? faEyeSlash : faEye}
//       onClick={() => setShowPassword(!showPassword)}
//       className="passwordIcon"
//     />
//   </div>
//   {errors.confirmNewPassword && <p className="requerido">Este campo es requerido</p>}
// </label>
// <button className="agregarBtn" type="submit">
//   Cambiar Contraseña
// </button>
// <button className="cancelarBtn" onClick={() => setModalIsOpen(false)}>
//   Cancelar
// </button>
// </form>
