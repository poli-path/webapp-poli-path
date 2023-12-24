import React, { useState } from 'react';
import '../styles/Administrador/MenuAdministrador.css';
import Nestor from '../assets/FotoNstor.jpg'

import Bienvenida from "../components/Administrador/Bienvenida";
import Usuarios from "../components/Administrador/Usuarios";
import Administradores from "../components/Administrador/Administradores";
import Edificios from "../components/Administrador/Edificios";
import Facultades from "../components/Administrador/Facultades";
import Laboratorios from "../components/Administrador/Laboratorios";
import Oficinas from "../components/Administrador/Oficinas";
import DatosUsuario from "../components/Administrador/DatosUsuario";

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';



const Administrador = () => {
    // Añade un estado para rastrear si el menú está abierto o no
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función para manejar el clic en el botón de alternar
    const handleToggleClick = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  return (
    <div className="container">
      {/* Añade un botón para alternar el menú */}
      <button className="toggle-button" onClick={handleToggleClick}>
        {isMenuOpen ? 'X' : '☰'}
      </button>

      {/* Añade la clase 'active' al menú cuando isMenuOpen es true */}
      <div className={`menu-admin ${isMenuOpen ? 'active' : ''}`}>
        <div className='logo'>
          <img src={Nestor} alt='User' />
          <h3>Néstor</h3>
        </div>
        <div className='editar'>
          <Link onClick={handleToggleClick} to="/administrador/editarperfil"><button>Editar Perfil</button></Link>
        </div>
        <div className='buttons'>
        <Link onClick={handleToggleClick} to="/administrador/usuarios"><button>Usuarios</button></Link>
          <Link onClick={handleToggleClick} to="/administrador/administradores"><button>Administradores</button></Link>
          <Link onClick={handleToggleClick} to="/administrador/edificios"><button>Edificios</button></Link>
          <Link onClick={handleToggleClick} to="/administrador/facultades"><button>Facultades</button></Link>
          <Link onClick={handleToggleClick} to="/administrador/laboratorios"><button>Laboratorios</button></Link>
          <Link onClick={handleToggleClick} to="/administrador/oficinas"><button>Oficinas</button></Link>
        </div>
        <div className='logout'>
          <Link to="/"><button>Salir</button></Link>
        </div>
      </div>
      <div className='content'>
        <Routes>
          <Route path="/" element={<Bienvenida/>} />
          <Route path="editarperfil" element={<DatosUsuario />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="administradores" element={<Administradores />} />
          <Route path="edificios" element={<Edificios />} />
          <Route path="facultades" element={<Facultades />} />
          <Route path="laboratorios" element={<Laboratorios />} />
          <Route path="oficinas" element={<Oficinas />} />
          {/* Agrega tus componentes aquí */}
        </Routes>
      </div>
    </div>
  );
}

export default Administrador;
