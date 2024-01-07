import React from 'react';
import '../../styles/Administrador/Bienvenida.css'
import logo from '../../assets/Logo.png'

const NotFoundPage = () => {
    return (
        <div className="bienvenida">
            <img src={logo} alt="Logo" className="logoNotFound"/>
            <h2 className="message">Lo sentimos, la sección que buscas no se encontró, prueba navegando en el menú para encontrar los diferentes servicios</h2>
        </div>
    );
};

export default NotFoundPage;
