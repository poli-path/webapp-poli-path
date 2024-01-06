
// ModoInvitado.js
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import MyMap from "../components/Invitado/MapaCampus";
import '../styles/ModoInvitado.css'

const ModoInvitado = () => {
    return (
      <div className="modo-invitado">
        <Navbar/>
        <div className="map-container">
          <MyMap/>
        </div>
        <Footer/>
      </div>
    );
};

export default ModoInvitado;
