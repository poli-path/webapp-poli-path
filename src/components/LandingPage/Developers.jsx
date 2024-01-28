import { FaWhatsapp, FaGithub} from "react-icons/fa";
import "../../styles/LandingPage/Developers.css";
import Nestor from "../../assets/FotoNstor.webp";
import Daniel from "../../assets/FotoDaniel.webp";
import Salo from "../../assets/FotoSalo.webp";

const Developers = () => {
  const mensaje = "Hola, quiero saber más sobre PoliPath";
  const salolink = `https://wa.me/593963562745?text=${encodeURIComponent(
    mensaje
  )}`;
  const neslink = `https://wa.me/593991155259?text=${encodeURIComponent(
    mensaje
  )}`;
  const danilink = `https://wa.me/593979005685?text=${encodeURIComponent(
    mensaje
  )}`;
  return (
    <div className="developers">
      <h1>Nuestro Equipo</h1>
      <div className="developers_v1">
        <div className="developer_info">
          <h2>Salomé Quispe</h2>
          <br />
          <p>
            Nuestra desarrolladora en backend, ha sido la arquitecta principal
            detrás de la funcionalidad sólida y eficiente que respalda PoliPath.
            Con un enfoque en la gestión de datos y la lógica del servidor, ha
            implementado un sistema robusto que garantiza un rendimiento óptimo
            y una experiencia sin problemas. Su pericia en la gestión de datos y
            la construcción de una lógica de servidor eficiente ha dado como
            resultado un sistema sólido que garantiza un rendimiento
            ininterrumpido y una gestión eficaz de la información. Desde la
            configuración de bases de datos hasta la implementación de API, Salo
            ha sido el maestro detrás de bastidores, asegurando que cada
            componente funcione en armonía.
          </p>
        </div>
        <div className="developer_contact">
          <img src={Salo} alt="Foto del desarrollador" />
          <a href={salolink} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
            Whatsapp
          </a>
          <a
            href="https://github.com/Salo-Quispe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            Github
          </a>
          {/* <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            Linkedin
          </a> */}
        </div>
      </div>
      <div className="developers_v2">
        <div className="developer_info">
          <h2>Néstor Chumania</h2>
          <br />
          <p>
            Nuestro arquitecto de la interfaz web de PoliPath, ha infundido vida
            y dinamismo a cada rincón de la aplicación. Con un dominio experto
            de tecnologías como React y Google Maps API, ha creado una
            experiencia web cautivadora. Su enfoque se ha centrado en la
            accesibilidad y en proporcionar a los usuarios una interfaz que no
            solo sea estéticamente agradable, sino también intuitiva y fácil de
            navegar. Enfocandose en la interfaz para administración de los datos
            de PoliPath para los administradores de nuestra aplicación
          </p>
        </div>
        <div className="developer_contact">
          <img src={Nestor} alt="Foto del desarrollador" />
          <a href={neslink} target="_blank" rel="noopener noreferrer">
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
          {/* <a
            href="https://www.linkedin.com/in/nestor-david-chumania-chumaña-2ab23a252/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            Linkedin
          </a> */}
        </div>
      </div>
      <div className="developers_v1">
        <div className="developer_info">
          <h2>Daniel Quishpe</h2>
          <br />
          <p>
            Nuestro desarrollador móvil, ha sido el cerebro detrás de la
            aplicación PoliPath para dispositivos móviles. Desde la integración
            de la geolocalización hasta la implementación de funciones que hacen
            uso de las capacidades únicas de los dispositivos móviles, Daniel ha
            llevado la aplicación a nuevas alturas. Su atención meticulosa a la
            experiencia del usuario asegura que la aplicación sea no solo
            funcional, sino también fácil de usar para la comunidad de la
            Escuela Politécnica Nacional.
          </p>
        </div>
        <div className="developer_contact">
          <img src={Daniel} alt="Foto del desarrollador" />
          <a href={danilink} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
            Whatsapp
          </a>
          <a
            href="https://github.com/DAQG"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            Github
          </a>
          {/* <a
            href="https://www.linkedin.com/in/nestor-david-chumania-chumaña-2ab23a252/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            Linkedin
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default Developers;
