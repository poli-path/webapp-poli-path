import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const WithAdminAuth = ({ children }) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const userRole = Cookies.get('roles'); // Asegúrate de guardar el rol del usuario cuando inicie sesión

  useEffect(() => {
    if (!token || !userRole.includes('admin')) {
      Swal.fire(
        'Acceso denegado',
        '¡Oh no! No tienes permiso para acceder a esta página, debes iniciar sesión',
        'error'
      );
      navigate('/'); // Redirige al usuario a la página de inicio si no tiene un token válido o si su rol no es de administrador
    }
  }, [navigate, token, userRole]);

  return <>{children}</>;
};

export default WithAdminAuth;
