import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "../../styles/Administrador/DatosUsuario.css";
import Nestor from "../../assets/Default.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { faCamera } from "@fortawesome/free-solid-svg-icons"; // Importa el icono de la cámara

Modal.setAppElement("#root");

const DatosUsuario = ({ setUserData, setUserImage }) => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalPasswordIsOpen, setModalPasswordIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("userData"); // Por defecto, el formulario activo es "userData"

  const [isEditable, setIsEditable] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [hoverImage, setHoverImage] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const userId = Cookies.get("id");
  const token = Cookies.get("token");
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

      // Establece los valores iniciales de los campos de entrada y la imagen en la previsualización
      setValue("nombre", data.name);
      setValue("apellido", data.lastname);
      setValue("imagen", data.imageUrl || Nestor);
      setPreviewImage(data.imageUrl || Nestor); // Establece la imagen actual en la previsualización

      setUserData({ ...data, imageUrl: data.imageUrl }); // Guarda la imageUrl en setUserData

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const onSubmitUserData = async (data) => {
    if (activeForm === "userData" && isEditable) {
      Swal.fire({
        title: "¿Estás seguro de editar estos datos?",
        showDenyButton: true,
        confirmButtonText: "Continuar",
        denyButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsSaving(true);
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
              const updatedUserData = { ...usuario, imagen: usuario.imagen };
              setUsuario(updatedUserData);
              setUserData(data);
              await getUserData();

              setIsEditable(false);
              toast.success("Datos actualizados exitosamente!");
            } else {
              throw new Error("Error al actualizar los datos");
            }
          } catch (error) {
            console.error("Error:", error);
          } finally {

            setIsSaving(false);
          }
        }
      });
    } else {
      setIsEditable(true);
      await getUserData();

      setActiveForm("userData");
    }
  };
  const handleImageHover = () => {
    setHoverImage(true);
  };

  const handleImageLeave = () => {
    setHoverImage(false);
  };

  const handleImageClick = () => {
    setModalIsOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreviewImage(URL.createObjectURL(file));
    
  };

  const handleCancelImageChange = () => {
    setModalIsOpen(false);
    setNewImage(null);
    setPreviewImage(usuario.imagen);

    setValue("imagen", "");
  };
  const openPasswordModal = () => {
    setModalPasswordIsOpen(true);
    setActiveForm("password");
  };

  const closePasswordModal = () => {
    setModalPasswordIsOpen(false);
    setActiveForm("userData"); // Cuando se cierra el modal de contraseña, activamos nuevamente el formulario de userData
  };

  const handleUploadImage = async () => {
    if (newImage) {
      const formData = new FormData();
      formData.append("file", newImage);

      try {
        setIsSaving(true);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/files/profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const updatedUserData = {
            ...usuario,
            imagen: response.data.imageUrl,
          };
          setUsuario(updatedUserData);
          setModalIsOpen(false);
          setNewImage(null);
          await getUserData();

          toast.success("Imagen actualizada exitosamente");

          setUserImage(response.data.imageUrl);
        } else {
          throw new Error("Error al actualizar la imagen");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al actualizar la imagen",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona una imagen",
      });
    }
  };

  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const onSubmitPassword = async (data) => {
    const { newPassword, confirmNewPassword } = data;
    const confirmError = document.querySelector(".confirmPasswordError");

    if (newPassword !== confirmNewPassword) {
      if (confirmError) {
        confirmError.textContent = "Las contraseñas no coinciden";
      }
      return;
    } else {
      setIsSavingPassword(true);
      confirmError.textContent = "";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      if (confirmError) {
        confirmError.textContent =
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número";
      }
      setIsSavingPassword(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/auth/change-password`,
        {
          id: userId,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Contraseña cambiada exitosamente");
        setModalPasswordIsOpen(false);

        setValue("oldPassword", "");
        setValue("newPassword", "");
        setValue("confirmNewPassword", "");
        setActiveForm("userData"); // Cuando se cierra el modal de contraseña, activamos nuevamente el formulario de userData
      } else {
        throw new Error("Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un problema al cambiar la contraseña",
      });
    } finally {
      setIsSavingPassword(false);
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
        {(activeForm === "userData" || activeForm === "password") && (
          <form onSubmit={handleSubmit(onSubmitUserData)}>
            <label>
              Nombre:
              <input
                type="text"
                {...register("nombre", {
                  required: isEditable,
                  minLength: isEditable ? 3 : undefined,
                  maxLength: isEditable ? 20 : undefined,
                  pattern: isEditable ? /^[^\s]+$/ : undefined,
                })}
                disabled={!isEditable}
              />
              {errors.nombre && (
                <p className="requerido">
                  {isEditable
                    ? "Este campo es requerido y debe tener al menos 3 caracteres (20 máximo) sin espacios"
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
                  maxLength: isEditable ? 20 : undefined,
                  pattern: isEditable ? /^[^\s]+$/ : undefined,
                })}
                disabled={!isEditable}
              />
              {errors.apellido && (
                <p className="requerido">
                  {isEditable
                    ? "Este campo es requerido y debe tener al menos 3 caracteres (20 máximo) sin espacios"
                    : ""}
                </p>
              )}
            </label>
          </form>
        )}
        {isSaving ? (
          <>
            <div style={{ fontSize: "25px" }}>Guardando tus datos...</div>
            <ClipLoader color="#3d8463" loading={isSaving} size={"30px"} />
          </>
        ) : (
          <>
            <button onClick={handleSubmit(onSubmitUserData)}>
              {isEditable ? "Guardar" : "Editar"}
            </button>
            <button onClick={openPasswordModal}>Cambiar Contraseña</button>
          </>
        )}
      </div>

      <div
        className="perfilUsuario"
        onMouseOver={handleImageHover}
        onMouseLeave={handleImageLeave}
        onClick={handleImageClick}
      >
        {hoverImage && (
          <div className="overlay">
            <p>Haz click para cambiar tu foto</p>
            <FontAwesomeIcon icon={faCamera} />
          </div>
        )}
        <img src={usuario.imagen} alt="Foto de perfil" />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>Cambiar Foto de Perfil</h2>
        <div className="foto">
          {previewImage && (
            <img src={previewImage} alt="Previsualización de la imagen" />
          )}{" "}
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
          />
        </div>

        {isSaving ? (
          <>
            <div style={{ fontSize: "10" }}>Actualizando Foto de Perfil...</div>
            <ClipLoader color="#3d8463" loading={isSaving} size={"30px"} />
          </>
        ) : (
          <>
            <div className="botones">
              <button className="agregarBtn" onClick={handleCancelImageChange}>
                Cancelar
              </button>
              <button className="cancelarBtn" onClick={handleUploadImage}>
                Cambiar
              </button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        isOpen={modalPasswordIsOpen}
        onRequestClose={() => setModalPasswordIsOpen(false)}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        {activeForm === "password" && (
          <form onSubmit={handleSubmit(onSubmitPassword)}>
            <h2>Cambiar Contraseña</h2>
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
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="passwordIcon"
                />
              </div>
              {errors.oldPassword && (
                <p className="requerido">Este campo es requerido</p>
              )}
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
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="passwordIcon"
                />
              </div>
              {errors.newPassword && (
                <p className="requerido">Este campo es requerido</p>
              )}
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
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="passwordIcon"
                />
              </div>
              {errors.confirmNewPassword && (
                <p className="requerido">Este campo es requerido</p>
              )}
              <p className="requerido confirmPasswordError"></p>
            </label>

            {isSavingPassword ? (
              <div className="botones">
                <ClipLoader
                  color="#3d8463"
                  loading={isSavingPassword}
                  size={"30px"}
                />
                <div style={{ fontSize: "10" }}>Actualizando contraseña...</div>
              </div>
            ) : (
              <div className="botones">
                <button className="cancelarBtn" onClick={closePasswordModal}>
                  Cancelar
                </button>
                <button className="agregarBtn" type="submit">
                  Cambiar Contraseña
                </button>
              </div>
            )}
          </form>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default DatosUsuario;
