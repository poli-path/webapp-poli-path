import Navbar from "../components/Navbar";
import RecoverPasswordCard from "../components/Administrador/RecoverPassCard";
import Footer from "../components/Footer";
import "../styles/Administrador/LoginAdministrador.css";

const RecoverAdministrador = () => {
  return (
    <div className="loginad-page-container">
      <Navbar />
      <div className="login-card">
        <RecoverPasswordCard />
      </div>
      <Footer />
    </div>
  );
};

export default RecoverAdministrador;
