import { Routes, Route, useLocation } from "react-router-dom"
import Login from './Login';
import React from 'react';
import Navigation from './components/Navigation/Navigation'
import Contact from './Contact';
import Politica from './Politica';
import CrudAdmi from './CrudAdmi';

import './scss/Login.scss';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="App">
      {!isLoginPage && <Navigation />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={ <Login/> } />
          <Route path="/Contact" element={ <Contact/> } />
          <Route path="/Navigation" element={ <Navigation/> } />
          <Route path="/Politica" element={ <Politica/> } />
          <Route path="/CrudAdmi" element={ <CrudAdmi/> } />
        </Routes>
      </div>
    </div>
  );
}

export default App;



