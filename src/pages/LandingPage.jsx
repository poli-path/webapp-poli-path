import React, { createRef } from 'react';
import Navbar from "../components/Navbar";
import MyCarousel from "../components/LandingPage/Carousel";
import AboutUs from "../components/LandingPage/AboutUs";
import Developers from "../components/LandingPage/Developers";
import MobileApp from "../components/LandingPage/MobileApp";
import Footer from "../components/Footer";
import '../styles/LandingPage.css'

const LandingPage = () => {
    const aboutUsRef = createRef();
    const mobileAppRef = createRef();

    return (
      <div className="landing-page-container">
        <Navbar />
        <div className="carousel-container">
          <MyCarousel aboutUsRef={aboutUsRef} mobileAppRef={mobileAppRef} />
        </div>
        <div ref={mobileAppRef}><MobileApp/></div>
        <div ref={aboutUsRef}><AboutUs/></div>
        <Developers/>
        <Footer/>
      </div>
    );
  };

export default LandingPage;