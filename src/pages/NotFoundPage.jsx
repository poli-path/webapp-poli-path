import React from 'react';
import '../styles/NotFoundPage.css'; // Asegúrate de crear este archivo CSS
import logo from '../assets/Logo.webp'; // Reemplaza esto con la ruta a tu logo

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <img src={logo} alt="Logo" className="logoNotFound"/>
            <h2 className="message">Lo sentimos, la página que buscas no se encontró.</h2>
        </div>
    );
};

export default NotFoundPage;
