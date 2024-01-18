import React from 'react';
import '../../styles/Administrador/Bienvenida.css'

const Bienvenida = () => {
  return (
    <div className='bienvenida'>
      <h2>Bienvenido al panel de administración</h2>
      <br />
      <br />
      <p>Como administrador, tienes la capacidad de realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en varias áreas y así poder mantener actualizada la aplicación:</p>
      <br />
      <br />
      <ul>
        <li><strong>Usuarios:</strong> Puedes ver e informarte sobre los usuarios que se han registrado en la aplicación</li>
        <li><strong>Administradores:</strong> Puedes ver, añadir y eliminar nuevos administradores que te ayuden con el manejo de la aplicación.</li>
        <li><strong>Edificios:</strong> Puedes ver, añadir, editar y eliminar edificios.</li>
        <li><strong>Facultades:</strong> Puedes ver, añadir, editar y eliminar facultades.</li>
        <li><strong>Laboratorios:</strong> Puedes ver, añadir, editar y eliminar laboratorios.</li>
        <li><strong>Oficinas:</strong> Puedes ver, añadir, editar y eliminar oficinas.</li>
        <li><strong>Puntos de Interés:</strong> Puedes ver, añadir, editar y eliminar Puntos de Interés.</li>
      </ul>
    </div>
  );
}

export default Bienvenida;
