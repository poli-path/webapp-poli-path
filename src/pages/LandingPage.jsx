import Navbar from "../components/Navbar";
import MyCarousel from "../components/LandingPage/Carousel";
import AboutUs from "../components/LandingPage/AboutUs";
import Developers from "../components/LandingPage/Developers";
import MobileApp from "../components/LandingPage/MobileApp";
import '../styles/LandingPage.css'

const LandingPage = () => {
    return (
      <div className="landing-page-container">
        <Navbar />
        <div className="carousel-container">
          <MyCarousel />
        </div>
        <MobileApp/>
        <AboutUs/>
        <Developers/>
      </div>
    );
  };

export default LandingPage
