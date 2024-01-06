import React, { useState } from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import Logo from "../assets/Logo.png";

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    
    return (
        <nav className='navbar'>
            <div className='navbar__logo'>
                <Link to='/'>
                    <img src={Logo} alt='Logo' />
                    <h1><strong>PoliPath</strong></h1>
                </Link>
            </div>
            <button onClick={toggleMenu} className='menu-btn'>Menu</button>
            <div className={`navbar__links ${showMenu ? 'show' : ''}`}>
                <Link to='/' className='navbar__link'><button>Inicio</button></Link>
                <Link to='/invitado' className='navbar__link'><button>Invitado</button></Link>
                <Link to='/admin' className='navbar__link'><button>Administrador</button></Link>
            </div>
        </nav>
    );
}

export default Navbar;
