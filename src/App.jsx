import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ModoInvitado from './pages/ModoInvitado';
import LoginAdministrador from './pages/LoginAdministrador';
import '@fontsource/keania-one';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
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