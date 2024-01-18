import "../../styles/LandingPage/AboutUs.css";
import ImgGift from "../../assets/Nosotros.webp";

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us__image">
        <img src={ImgGift} alt="Imagen Nosotros" />
      </div>
      <div className="about-us__description">
        <h2>¡Explora el Campus con Nosotros!</h2><br />
        <p>
          Como parte del equipo de PoliPath, parte integral de nuestro proyecto
          de titulación, nos hemos comprometido a brindarte una herramienta que
          simplifique tu experiencia en el campus de la Escuela Politécnica
          Nacional. Nos dedicamos a ofrecerte una aplicación de geolocalización
          intuitiva y completa que te permita navegar y descubrir cada faceta de
          nuestro campus de manera eficiente.
          <br />
          <br />
          Únete a nosotros en esta emocionante aventura de descubrimiento en la
          Escuela Politécnica Nacional. ¡Estamos aquí para facilitar tu
          exploración del campus como parte de nuestro proyecto de titulación!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
