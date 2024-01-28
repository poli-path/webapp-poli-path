import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/LandingPage/Carousel.css'; // Estilos personalizados para el carousel
import { Link } from 'react-router-dom';

const MyCarousel = ({ aboutUsRef, mobileAppRef }) => {
  const slides = [
    {
      title: 'PoliPath',
      content: 'Con nuestra aplicación, descubre cada rincón del campus, encontrar fácilmente edificios, laboratorios, facultades y más, ¡todo al alcance de tus manos!',
      buttonLabel: 'Nosotros',
      slideClass: 'slide-0',
      ref: aboutUsRef,
    },
    {
      title: 'Modo Invitado',
      content: 'Acceso a una versión simplificada de nuestra aplicación que te permite navegar entre los edificios y obtener una vista general del campus. ¡Pruébalo!',
      buttonLabel: 'Probar',
      slideClass: 'slide-1',
      link: '/invitado',
    },
    {
      title: 'App Móvil',
      content: 'Si deseas acceder a información detallada sobre cada punto de interés y disfrutar de todas las funcionalidades, te invitamos a usar nuestra app móvil',
      buttonLabel: 'Leer más',
      slideClass: 'slide-2',
      ref: mobileAppRef,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    adaptiveHeight: true,
    arrows: false
  };
  
  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${slide.slideClass}`}
          >
            <div className="carousel-content">
              <h1 className={index === 0 ? 'title-left' : 'title-right'}>{slide.title}</h1>
              <p className={index === 0 ? 'content-left' : 'content-right'}>{slide.content}</p>
              {slide.link ? (
                <Link to={slide.link} className="slide-button">{slide.buttonLabel}</Link>
              ) : (
                <button onClick={() => slide.ref.current.scrollIntoView({ behavior: 'smooth' })} className="slide-button">{slide.buttonLabel}</button>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MyCarousel;
