import { FaWhatsapp, FaGithub, FaLinkedin } from "react-icons/fa";
import "../../styles/LandingPage/Developers.css";
import Nestor from "../../assets/FotoNstor.jpg";
import Daniel from "../../assets/FotoDaniel.jpg";

const Developers = () => {
  return (
    <div className="developers">
      <h1>Nuestro Equipo</h1>
      <div className="developers_v1">
        <div className="developer_info">
          <h2>Néstor Chumania</h2>
          <p>          Como parte del equipo de PoliPath, parte integral de nuestro proyecto
          de titulación, nos hemos comprometido a brindarte una herramienta que
          simplifique tu experiencia en el campus de la Escuela Politécnica
          Nacional. Nos dedicamos a ofrecerte una aplicación de geolocalización
          intuitiva y completa que te permita navegar y descubrir cada faceta de
          nuestro campus de manera eficiente.</p>
        </div>
        <div className="developer_contact">
          <img src={Nestor} alt="Foto del desarrollador" />
          <a
            href="https://w.app/widget-v1/2CbTOY.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsap
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
        <div className="developer_contact">
          <img src={Nestor} alt="Foto del desarrollador" />
          <a
            href="https://w.app/widget-v1/2CbTOY.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsap
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
        <div className="developer_info">
          <h2>Néstor Chumania</h2>
          <p>          Como parte del equipo de PoliPath, parte integral de nuestro proyecto
          de titulación, nos hemos comprometido a brindarte una herramienta que
          simplifique tu experiencia en el campus de la Escuela Politécnica
          Nacional. Nos dedicamos a ofrecerte una aplicación de geolocalización
          intuitiva y completa que te permita navegar y descubrir cada faceta de
          nuestro campus de manera eficiente.</p>
        </div>
      </div>
      <div className="developers_v1">
        <div className="developer_info">
          <h2>Néstor Chumania</h2>
          <p>          Como parte del equipo de PoliPath, parte integral de nuestro proyecto
          de titulación, nos hemos comprometido a brindarte una herramienta que
          simplifique tu experiencia en el campus de la Escuela Politécnica
          Nacional. Nos dedicamos a ofrecerte una aplicación de geolocalización
          intuitiva y completa que te permita navegar y descubrir cada faceta de
          nuestro campus de manera eficiente.</p>
        </div>
        <div className="developer_contact">
          <img src={Daniel} alt="Foto del desarrollador" />
          <a
            href="https://w.app/widget-v1/2CbTOY.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Whatsap
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
