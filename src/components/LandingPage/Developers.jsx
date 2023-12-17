import { FaWhatsapp, FaGithub, FaLinkedin } from "react-icons/fa";
import "../../styles/LandingPage/Developers.css";
import Nestor from "../../assets/FotoNstor.jpg";
import Daniel from "../../assets/FotoDaniel.jpg";
import Salo from "../../assets/FotoSalo.jpg";

const Developers = () => {
  return (
    <div className="developers">
      <h1>Nuestro Equipo</h1>
      <div className="developers_v1">
        <div className="developer_info">
          <h2>Salomé Quispe</h2><br />
          <p>          Como parte del equipo de PoliPath</p>
        </div>
        <div className="developer_contact">
          <img src={Salo} alt="Foto del desarrollador" />
          <a
            href="https://w.app/widget-v1/2CbTOY.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsapp
          </a>
          <a
            href="https://github.com/RotsenCH?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/nestor-david-chumania-chumaña-2ab23a252/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            Linkedin
          </a>
        </div>
      </div>
      <div className="developers_v2">
      <div className="developer_info">
          <h2>Néstor Chumania</h2><br />
          <p>          Como parte del equipo de PoliPath</p>
        </div>
        <div className="developer_contact">

          <img src={Nestor} alt="Foto del desarrollador" />
          <a
            href="https://w.app/widget-v1/2CbTOY.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsapp
          </a>
          <a
            href="https://github.com/RotsenCH?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/nestor-david-chumania-chumaña-2ab23a252/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            Linkedin
          </a>
        </div>

      </div>
      <div className="developers_v1">
        <div className="developer_info">
          <h2>Daniel Quishpe</h2><br />
          <p>          Como parte del equipo de PoliPath.</p>
        </div>
        <div className="developer_contact">
          <img src={Daniel} alt="Foto del desarrollador" />
          <a
            href="https://w.app/widget-v1/2CbTOY.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsapp
          </a>
          <a
            href="https://github.com/RotsenCH?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/nestor-david-chumania-chumaña-2ab23a252/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            Linkedin
          </a>
        </div>
      </div>
    </div>
  );
};

export default Developers;
