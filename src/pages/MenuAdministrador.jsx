import React, { useState, useEffect } from "react";
import "../styles/Administrador/MenuAdministrador.css";
import NotFoundPage from "../components/Administrador/NotFoundPageAdmin"; // Asegúrate de crear este componente
import Bienvenida from "../components/Administrador/Bienvenida";
import Usuarios from "../components/Administrador/Usuarios";
import Administradores from "../components/Administrador/Administradores";
import Edificios from "../components/Administrador/Edificios";
import Facultades from "../components/Administrador/Facultades";
import Laboratorios from "../components/Administrador/Laboratorios";
import Oficinas from "../components/Administrador/Oficinas";
import DatosUsuario from "../components/Administrador/DatosUsuario";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Adminis from "../assets/Default.webp"; // Esta será tu imagen por defecto
import ClipLoader from "react-spinners/ClipLoader";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import axios from "axios"; // Asegúrate de tener axios instalado

const Administrador = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userLastname, setUserLastname] = useState("");
  const [userImage, setUserImage] = useState("");
  const [usuario, setUsuario] = useState(null);

  const fetchData = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${Cookies.get("id")}`,
      { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
    );
    setUserName(result.data.name);
    setUserLastname(result.data.lastname);
    setUserImage(result.data.imageUrl || Adminis);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [usuario, setUsuario]); // Agrega setUsuario como dependencia

  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
  };

  const handleToggleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/");
  };

  return (
    <div className="container">
      <button className="toggle-button" onClick={handleToggleClick}>
        {isMenuOpen ? "X" : "☰"}
      </button>

      <div className={`menu-admin ${isMenuOpen ? "active" : ""}`}>
        <div className="logo">
          {isLoading ? (
            <>
              <ClipLoader color="#3d8463" loading={isLoading} size={"90px"} />
              <div style={{ fontSize: "20px" }}>Cargando tu información...</div>
            </>
          ) : (
            <>
              <img src={userImage} alt="User" style={{ objectFit: "cover" }} />
              <h3 className="truncated" title={`${userName} ${userLastname}`}>
                {`${userName} ${userLastname}`}
              </h3>
            </>
          )}
        </div>
        <div className="editar">
          <Link onClick={handleToggleClick} to="/administrador/editarperfil">
            <button>Editar Perfil</button>
          </Link>
        </div>
        <div className="buttons">
          <Link onClick={handleToggleClick} to="/administrador/usuarios">
            <button>Usuarios</button>
          </Link>
          <Link onClick={handleToggleClick} to="/administrador/administradores">
            <button>Administradores</button>
          </Link>
          <Link onClick={handleToggleClick} to="/administrador/edificios">
            <button>Edificios</button>
          </Link>
          <Link onClick={handleToggleClick} to="/administrador/facultades">
            <button>Facultades</button>
          </Link>
          <Link onClick={handleToggleClick} to="/administrador/laboratorios">
            <button>Laboratorios</button>
          </Link>
          <Link onClick={handleToggleClick} to="/administrador/oficinas">
            <button>Oficinas</button>
          </Link>
        </div>
        <div className="logout">
          <button onClick={handleLogoutClick}>Salir</button>
        </div>
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route
            path="editarperfil"
            element={
              <DatosUsuario
                setUserData={setUsuario}
                setUserImage={setUserImage}
              />
            }
          />

          <Route path="usuarios" element={<Usuarios />} />
          <Route path="administradores" element={<Administradores />} />
          <Route path="edificios" element={<Edificios />} />
          <Route path="facultades" element={<Facultades />} />
          <Route path="laboratorios" element={<Laboratorios />} />
          <Route path="oficinas" element={<Oficinas />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Administrador;
