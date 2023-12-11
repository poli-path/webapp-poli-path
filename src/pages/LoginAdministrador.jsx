import Navbar from "../components/Navbar";
import LoginCard from "../components/Administrador/LoginCard";
import Footer from "../components/Footer";
import "../styles/Administrador/LoginAdministrador.css";

const LandingPage = () => {
  return (
    <div className="loginad-page-container">
      <Navbar />
      <div className="login-card">
        <LoginCard />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
