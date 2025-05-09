import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import './Navigation.scss';

const Navigation = () => {
  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      // Limpiar localStorage
      localStorage.removeItem('uid');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('profilePic');
      localStorage.removeItem('username'); // Si también lo estás usando
      console.log('Sesión cerrada exitosamente');

      // Redirigir al usuario a la URL después de cerrar sesión
      window.location.href = 'http://localhost:3000';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className='navigation'>
      <div className='navigation__logo'>
        <img src={'https://campusvirtual.utn.ac.cr/pluginfile.php/1/core_admin/logocompact/300x300/1675189388/logocompacto.png'} alt="logo" />
        <label className="navigation__welcome">Bienvenido: {localStorage.getItem('name')}</label>
      </div>
      <div className='navigation__menu'>
        <ul>
          <li>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;



