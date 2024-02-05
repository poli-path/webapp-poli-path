import { FaDownload } from "react-icons/fa6";
import "../../styles/LandingPage/MobileApp.css";
import ImgGift from "../../assets/App_Mvil.webp";

const MobileApp = () => {
  return (
    <div className="mobile-app">
      <div className="mobile-app__description">
        <h2>¡Bienvenido a PoliPath!</h2><br />

        <p>
          En PoliPath, te ofrecemos la herramienta perfecta para explorar y
          navegar el campus de la Escuela Politécnica Nacional de una manera
          sencilla y eficiente.
          <br />

          <br />
          Regístrate para obtener acceso completo y disfruta de una experiencia
          de usuario personalizada. ¡Descubre lo fácil que es encontrar lo que
          necesitas en nuestro campus con solo unos pocos clics!
          <br />
          <br />
          ¡Únete a nuestra comunidad y comienza a explorar hoy mismo!
        </p>
        <br />
        <a
          href="https://movilapppolipath.es.aptoide.com/app"
          target="_blank"
          rel="noopener noreferrer"          className="app-download-button"
        >
          <FaDownload style={{marginRight:"5px"}}/>
            Descargar <strong>Poli Path</strong>
        </a>
      </div>
      <div className="mobile-app__gif">
        <img src={ImgGift} alt="Gif de la app movil" />
      </div>
    </div>
  );
};

export default MobileApp;
