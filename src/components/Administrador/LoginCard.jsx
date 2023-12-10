import React from 'react';
import '../../styles/Administrador/LoginCard.css';

const LoginCard = () => {
  return (
    <div className='my-container'>

      <div className='my-row'>
        <div className='my-col'>

          <div className='my-card cascading-right'>
            <div className='my-card-body'>

              <h2 className="fw-bold mb-5">Iniciar sesión</h2>

              <input className='my-input' placeholder='Usuario' id='form1' type='text'/>
              <input className='my-input' placeholder='Contraseña' id='form2' type='password'/>

              <button className='my-button'>Iniciar sesión</button>

              <div className="text-center">
                <p><a href="/administrador">Olvidé mi contraseña y usuario</a></p>
              </div>

            </div>
          </div>
        </div>

        <div className='my-col'>
          <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" className='my-img'
            alt="" />
        </div>

      </div>

    </div>
  );
}

export default LoginCard;