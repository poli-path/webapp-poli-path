import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ModoInvitado from "./pages/ModoInvitado";
import LoginAdministrador from "./pages/LoginAdministrador";
import MenuAdministrador from "./pages/MenuAdministrador";
import RecoverAdministrador from "./pages/RecoverAdministrador";
import "@fontsource/keania-one";
import "./App.css";
import lightModeIcon from "./assets/LightMode.png";
import darkModeIcon from "./assets/DarkMode.png";

function App() {
    const [darkMode, setDarkMode] = useState(false);
  
    const toggleDarkMode = () => setDarkMode(!darkMode);
  
    return (
      <Router>
        <div className={`App ${darkMode ? 'light-mode' : 'dark-mode'}`}>
          <button className="my-button" onClick={toggleDarkMode} title={darkMode ? 'Modo claro activado' : 'Modo oscuro activado'}>
            <img src={darkMode ? lightModeIcon : darkModeIcon} alt="Modo" className="imgbutton"/>
          </button>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/invitado" element={<ModoInvitado />} />
            <Route path="/admin" element={<LoginAdministrador />} />
            <Route path="/recuperar" element={<RecoverAdministrador />} />
            <Route path="/administrador/*" element={<MenuAdministrador />} />
            {/* Puedes añadir más rutas según sea necesario */}
          </Routes>
        </div>
      </Router>
    );
  }
  
  export default App;