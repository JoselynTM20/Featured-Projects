import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { registerWithEmailAndPassword, loginWithEmailAndPassword, signInWithGoogle } from './firebase';
import './scss/Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    signInWithGoogle()
      .catch((error) => {
        setError('Error en el inicio de sesión con Google: ' + error.message);
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Registro
        await registerWithEmailAndPassword(email, password, name);
        window.location.href = "/Contact";
      } else {
        // Inicio de sesión
        await loginWithEmailAndPassword(email, password);
        window.location.href = "/Contact";
      }
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/operation-not-allowed':
          errorMessage = 'La autenticación con email/contraseña no está habilitada. Por favor, contacta al administrador.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está registrado.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta.';
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="Form">
      <div className="login-container">
        <div className="login-content">
          <h2>{isRegistering ? 'Registro' : 'Bienvenido'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="submit-btn">
                {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
              </button>
              <div className="divider">
                <span>o</span>
              </div>
              <button type="button" onClick={handleSignIn} className="google-btn">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Continuar con Google
              </button>
              <button type="button" onClick={toggleMode} className="submit-btn">
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </form>
        </div>
        <div className="login-image">
          <div>
            <h3>Bienvenido a nuestra plataforma</h3>
            <p>Accede a todas las funcionalidades y servicios que tenemos para ti</p>
            <h3>NOTA</h3>
            <p>Para probar nuestro sistema como administrador usa correo: prueba@gmail.com y contraseña: 123456789</p>
            <p>Para probar nuestro sistema como customer usa correo: prueba2@gmail.com y contraseña: 123456789</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

