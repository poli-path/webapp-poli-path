import React, { useEffect, useRef } from "react";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { ScatterplotLayer } from "@deck.gl/layers";
import "../../styles/Invitado/MapaCampus.css";

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_GOOGLE_MAPS}&callback=initMap`;
      script.async = true;
      window.initMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: -0.2106, lng: -78.4882 }, // Coordenadas del Campus EPN
          zoom: 15,
        });

        const overlay = new GoogleMapsOverlay({
          layers: [
            new ScatterplotLayer({
              id: 'scatterplot-layer',
              data: [
                { position: [-0.21231, -78.49039] },
                { position: [-0.21196, -78.49204] },
              ],
              getRadius: 100, // radio de los marcadores
              getFillColor: [255, 140, 0], // color de los marcadores
              getPosition: d => d.position,
            }),
          ],
        });

        overlay.setMap(map);
      };
      document.head.appendChild(script);
    } else {
      window.initMap();
    }
  }, []);

  return (
    <div className="mapInvitado">
      <h2>Modo Invitado: Campus EPN</h2>
      <p>
        Este es un componente que te permite interactuar con el mapa del Campus
        EPN. Puedes buscar un lugar, moverte de un lugar a otro y descargar
        nuestra aplicación móvil para una experiencia más completa.
      </p>
      <div className="main-container">
        <div className="search-container">
          <h2>Buscador</h2>
          {/* Aquí puedes agregar el input para buscar un lugar y los botones para moverse y descargar la app */}
        </div>
        <div className="map-container">
          <div ref={mapRef} className="map" />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
