import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/Logo.png";
import '../styles/Administrador/MenuAdministrador.css';

const MenuAdministrador = () => {
  return (
    <div className='menu-admin'>
      <div className='logo'>
        <img src={Logo} alt='App logo' />
      </div>
      <div className='buttons'>
        <button>Usuarios</button>
        <button>Edificios</button>
        <button>Editar/Añadir Edificios</button>
      </div>
      <div className='logout'>
        <Link to="/"><button>Salir</button></Link>
      </div>
    </div>
  );
}

export default MenuAdministrador;
