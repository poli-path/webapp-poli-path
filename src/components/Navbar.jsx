import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import React from 'react';
import Logo from "../assets/Logo.png";

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='navbar__logo'>
                <Link to='/'>
                    <img src={Logo} alt='Logo' />
                    <h1><strong>PoliPath</strong></h1>
                </Link>
            </div>
            <div className='navbar__links'>
                <Link to='/' className='navbar__link'><button>Inicio</button></Link>
                <Link to='/invitado' className='navbar__link'><button>Invitado</button></Link>
                <Link to='/admin' className='navbar__link'><button>Administrador</button></Link>
            </div>
        </nav>
    );
}

export default Navbar;
