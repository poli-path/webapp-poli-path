import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ModoInvitado from "./pages/ModoInvitado";
import LoginAdministrador from "./pages/LoginAdministrador";
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
            <img src={darkMode ? lightModeIcon : darkModeIcon} alt="Modo" style={{ width: 150, height: 'auto', borderRadius:500 }} />
          </button>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/invitado" element={<ModoInvitado />} />
            <Route path="/admin" element={<LoginAdministrador />} />
            {/* Puedes añadir más rutas según sea necesario */}
          </Routes>
        </div>
      </Router>
    );
  }
  
  export default App;