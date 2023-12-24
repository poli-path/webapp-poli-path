import React from 'react';
import '../../styles/Administrador/DatosUsuario.css'

const DatosUsuario = () => {
  return (
    <div className='datosUsuario'>
      <h2>Usuario</h2>
      <br />
      <br />
      <p>Como administrador, tienes la capacidad de realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en varias áreas:</p>
      <br />
      <br />
      
      <ul>
        <li><strong>Usuarios:</strong> Puedes ver, añadir, editar y eliminar usuarios.</li>
        <li><strong>Administradores:</strong> Puedes ver, añadir, editar y eliminar administradores.</li>
        <li><strong>Edificios:</strong> Puedes ver, añadir, editar y eliminar edificios.</li>
        <li><strong>Facultades:</strong> Puedes ver, añadir, editar y eliminar facultades.</li>
        <li><strong>Laboratorios:</strong> Puedes ver, añadir, editar y eliminar laboratorios.</li>
        <li><strong>Oficinas:</strong> Puedes ver, añadir, editar y eliminar oficinas.</li>
      </ul>
    </div>
  );
}

export default DatosUsuario;
