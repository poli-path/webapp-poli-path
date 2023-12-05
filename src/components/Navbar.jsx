import React from 'react';
import '../styles/Navbar.css'
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='navbar__logo'>
                <img src='../assets/Logo.png' alt='Logo'/>
                <h1>PoliPath</h1>
            </div>
            <div className='navbar__links'>
                <Link to='/'>Inicio</Link>
                <Link to='/invitado'>Modo Invitado</Link>
                <Link to='/admin'>Administrador</Link>
            </div>
        </nav>
    )
}