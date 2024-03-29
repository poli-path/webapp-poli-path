// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ModoInvitado from "./pages/ModoInvitado";
import LoginAdministrador from "./pages/LoginAdministrador";
import MenuAdministrador from "./pages/MenuAdministrador";
import RecoverAdministrador from "./pages/RecoverAdministrador";
import NotFoundPage from "./pages/NotFoundPage"; // Asegúrate de crear este componente
import "@fontsource/keania-one";
import "./App.css";
import lightModeIcon from "./assets/LightMode.webp";
import darkModeIcon from "./assets/DarkMode.webp";
import WithAdminAuth from './hoc/WithAdminAuth';
import { LoadScript } from "@react-google-maps/api";
// Crear el contexto para el estado del script de Google Maps
export const GoogleMapsContext = React.createContext();

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const [usuario, setUsuario] = useState(null); // Estado de usuario

  // Función para actualizar usuario que se pasa como prop a DatosUsuario
  const actualizarUsuario = (nuevosDatos) => {
    setUsuario(nuevosDatos);
  };
  return (
    <Router>
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}   libraries={["places"]}>
    
        <div className={`App ${darkMode ? 'light-mode' : 'dark-mode'}`}>
          <button className="my-button" onClick={toggleDarkMode} title={darkMode ? 'Modo claro activado' : 'Modo oscuro activado'}>
            <img src={darkMode ? lightModeIcon : darkModeIcon} alt="Modo" className="imgbutton"/>
          </button>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/invitado" element={<ModoInvitado />} />
            <Route path="/admin" element={<LoginAdministrador />} />
            <Route path="/recuperar" element={<RecoverAdministrador />} />
            <Route path="/administrador/*" element={<WithAdminAuth><MenuAdministrador /></WithAdminAuth>} />
            <Route path="*" element={<NotFoundPage />} /> {/* Esta es la ruta por defecto para las páginas no encontradas */}
          </Routes>
        </div>
        </LoadScript>
    </Router>
  );
}

export default App;
