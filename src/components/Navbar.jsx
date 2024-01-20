import React, { useState } from 'react';
import '../styles/Navbar.css';
import { NavLink } from 'react-router-dom';
import Logo from "../assets/Logo.webp";

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <nav className='navbar'>
            <div className='navbar__logo'>
                <NavLink to='/' onClick={scrollToTop}>
                    <img src={Logo} alt='Logo' />
                    <h1><strong>PoliPath</strong></h1>
                </NavLink>
            </div>
            <button onClick={toggleMenu} className='menu-btn'>Menu</button>
            <div className={`navbar__links ${showMenu ? 'show' : ''}`}>
                <NavLink to='/' onClick={scrollToTop} className='navbar__link'><button>Inicio</button></NavLink>
                <NavLink to='/invitado' onClick={scrollToTop} className='navbar__link'><button>Invitado</button></NavLink>
                <NavLink to='/admin' onClick={scrollToTop} className='navbar__link'><button>Administrador</button></NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
