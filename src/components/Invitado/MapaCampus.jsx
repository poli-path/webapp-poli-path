import { FaGooglePlay } from "react-icons/fa";
import "../../styles/Invitado/MapaCampus.css";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import MarkerMi from "../../assets/Marker.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MapContainer = () => {
  const [buildings, setBuildings] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [startLocationCoords, setStartLocationCoords] = useState(null);
  const [startBuilding, setStartBuilding] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const handleMarkerClick = (building) => {
    setSelectedBuilding(building);
    setInfoWindowOpen(true);
  };

  const handleCloseInfoWindow = () => {
    setInfoWindowOpen(false);
  };

  const directionsService = new window.google.maps.DirectionsService();

  const handleClearRoute = () => {
    setDirections(null);
    setSelectedBuilding(null);
    setInfoWindowOpen(false);
  };

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setStartLocationCoords({
      lat: building.latitude,
      lng: building.longitude,
    });
    setStartLocation("");
    setInfoWindowOpen(false);
  };

  const handleSelect = (e) => {
    const building = buildings.find(
      (b) => b.name === e.target.value || b.no === e.target.value
    );
    if (building) {
      handleBuildingSelect(building);
      setDirections(null);
    }
  };

  const handleViewRoute = () => {
    if ((startLocationCoords || startBuilding) && selectedBuilding) {
      const origin = startBuilding
        ? {
            lat: startBuilding.latitude,
            lng: startBuilding.longitude,
          }
        : userLocation;

      directionsService.route(
        {
          origin: origin,
          destination: {
            lat: selectedBuilding.latitude,
            lng: selectedBuilding.longitude,
          },
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${result}`);
          }
        }
      );

      setInfoWindowOpen(false);
    }
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/buildings/guests"
      );
      setBuildings(result.data);
    };
    fetchBuildings();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const directionsRendererOptions = {
    polylineOptions: {
      strokeColor: "#8C0303",
      strokeWeight: 10,
    },
  };

  const mapOptions = {
    mapContainerStyle: { width: "100%", height: "70vh" },
    center: selectedBuilding
      ? { lat: selectedBuilding.latitude, lng: selectedBuilding.longitude }
      : userLocation || { lat: -0.21055556, lng: -78.48888889 },
    zoom: 19,
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
    styles: [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "red" }]
      }
    ]
  };

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
          <h3>Llegar hasta el Edificio:</h3>
          <br />
          <select onChange={handleSelect} style={{ width: "200px" }}>
            <option value="">Selecciona un edificio</option>
            {buildings.map((building, index) => (
              <option key={index} value={building.name}>
                No.{building.no} "{building.name}"
              </option>
            ))}
          </select>
          <br />
          <br />
          <button onClick={handleViewRoute}>Ir al Edificio</button>
          <br />
          <br />
          <button onClick={handleClearRoute}>Borrar Ruta</button>
        </div>
        <div className="map-content">
          <GoogleMap {...mapOptions}>
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={directionsRendererOptions}
              />
            )}
            {buildings.map((building, index) => (
              <Marker
                key={index}
                position={{
                  lat: building.latitude,
                  lng: building.longitude,
                }}
                icon={{
                  url: MarkerMi,
                  scaledSize: new window.google.maps.Size(70, 100),
                  labelOrigin: new window.google.maps.Point(35, 110),
                }}
                onClick={() => handleMarkerClick(building)}
                label={{
                  text: building.name,
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "20px",
                  backgroundColor: "aliceblue"
                
                }}
                animation={window.google.maps.Animation.DROP}
              />
            ))}
            {selectedBuilding && infoWindowOpen && (
              <div className="prueba">
                <InfoWindow
                  position={{
                    lat: selectedBuilding.latitude,
                    lng: selectedBuilding.longitude,
                  }}
                  onCloseClick={handleCloseInfoWindow}
                >
                  <div className="infoContent">
                    <h2>{selectedBuilding.name}</h2>
                    <Carousel>
                      {selectedBuilding.imageUrls.map((url, index) => (
                        <div key={index}>
                          <img
                            src={`https://3bcbgw62-3000.use.devtunnels.ms/${url}`}
                            alt={`Building ${selectedBuilding.name} ${index}`}
                            style={{
                              maxWidth: "250px",
                              maxHeight: "150px",
                              width: "auto",
                              height: "auto",
                            }}
                          />
                        </div>
                      ))}
                    </Carousel>
                    <p style={{ color: "black" }}>
                      {selectedBuilding.description}
                    </p>
                  </div>
                </InfoWindow>
              </div>
            )}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: MarkerMi,
                  scaledSize: new window.google.maps.Size(70, 100),
                  labelOrigin: new window.google.maps.Point(35, 110),
                }}
                label={{
                  text: "Tu ubicación",
                  color: "black",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                animation={window.google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        </div>
      </div>
      <div style={{ margin: 20 }}>
        <h3>
          No olvides descargar la versión completa de PoliPath exclusivamente
          para la Comunidad Politécnica
        </h3>
        <a
          href="https://play.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="app-download-button"
          style={{ padding: 0 }}
        >
          <FaGooglePlay />
          Descargar desde Google Play
        </a>
      </div>
    </div>
  );
};

export default MapContainer;
