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
import MarkerMi from "../../assets/Marker.webp";
import PoliPath from "../../assets/App_Mvil.webp";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ClipLoader from "react-spinners/ClipLoader"; // Importa ClipLoader
import EntradasMarker from "../../assets/Entradas.webp";

const MapContainer = () => {
  const [buildings, setBuildings] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [startLocationCoords, setStartLocationCoords] = useState(null);
  const [startBuilding, setStartBuilding] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [directionsInstructions, setDirectionsInstructions] = useState([]);
  const [destinationBuilding, setDestinationBuilding] = useState(null);

  const handleMarkerClick = (building) => {
    // Verifica si el marcador pertenece a defaultPoints
    const isDefaultPoint = defaultPoints.some(
      (defaultBuilding) =>
        defaultBuilding.latitude === building.latitude &&
        defaultBuilding.longitude === building.longitude
    );

    // Si no es un punto predeterminado, permite abrir la InfoWindow
    if (!isDefaultPoint) {
      setSelectedBuilding(building);
      setInfoWindowOpen(true);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleCloseInfoWindow = () => {
    setInfoWindowOpen(false);
  };

  const directionsService = new window.google.maps.DirectionsService();

  const handleClearRoute = () => {
    setDirections(null);
    setSelectedBuilding(null);
    setInfoWindowOpen(false);
    setDirectionsInstructions([]); // Añade esta línea
  };

  const handleBuildingSelect = (
    building,
    isStartBuilding,
    isCurrentLocation
  ) => {
    if (isStartBuilding) {
      setStartBuilding(building);
      setStartLocationCoords({
        lat: building ? building.latitude : userLocation.lat,
        lng: building ? building.longitude : userLocation.lng,
      });
    } else {
      setDestinationBuilding(building);
    }

    setSelectedBuilding(building);
    setInfoWindowOpen(false);

    // Si es la ubicación actual, establece la ubicación del usuario
    if (isCurrentLocation) {
      setStartLocation("currentLocation");
    }
  };

  const handleSelect = (e, isStartBuilding) => {
    const value = e.target.value;

    if (value === "currentLocation") {
      // Si la opción es "currentLocation", utiliza la ubicación actual del usuario
      handleBuildingSelect(null, isStartBuilding, true);
    } else {
      // Si la opción es un edificio, busca el edificio correspondiente
      const building = buildings.find(
        (b) => b.name === value || b.no === value
      );

      if (building) {
        handleBuildingSelect(building, isStartBuilding, false);
        setDirections(null);
      }
    }
  };

  const handleViewRoute = () => {
    if ((startLocationCoords || startBuilding) && destinationBuilding) {
      setIsLoading(true);
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
            lat: destinationBuilding.latitude,
            lng: destinationBuilding.longitude,
          },
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            // Guarda las instrucciones de las direcciones
            const instructions = result.routes[0].legs[0].steps.map(
              (step) => step.instructions
            );
            setDirectionsInstructions(instructions);
          } else {
            console.error(`Error fetching directions: ${result}`);
          }
        }
      );

      setInfoWindowOpen(false);
    }
    setIsLoading(false);
  };

  // Antes de tu useEffect:
  const defaultPoints = [
    { name: "Entrada Civil", latitude: -0.21189, longitude: -78.492015 },
    { name: "Entrada Teatro", latitude: -0.212287, longitude: -78.490395 },
    { name: "Entrada Química", latitude: -0.209893, longitude: -78.488774 },
    { name: "Entrada Tecnólogos", latitude: -0.209488, longitude: -78.487954 },
    { name: "Entrada Eléctrica", latitude: -0.208865, longitude: -78.489415 },
    { name: "Entrada Toledo", latitude: -0.209527, longitude: -78.486717 },
    { name: "Entrada CCICEV", latitude: -0.209196, longitude: -78.486406 },
  ];

  // Dentro de tu useEffect:
  const fetchBuildings = async () => {
    const result = await axios.get(
      process.env.REACT_APP_API_URL + "/buildings/guests"
    );
    setBuildings([...defaultPoints, ...result.data]);
  };

  useEffect(() => {
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
  const settings = {
    dots: true,
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    adaptiveHeight: true,
    arrows: false,
  };
  const mapOptions = {
    mapContainerStyle: { width: "100%", height: "100%" },
    center: selectedBuilding
      ? { lat: selectedBuilding.latitude, lng: selectedBuilding.longitude }
      : userLocation || { lat: -0.21055556, lng: -78.48888889 },
    zoom: 19,
    mapId: "9ddcb7692f5e8d1",
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
    styles: [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "red" }],
      },
    ],
  };
  const markerDimensions = {
    width: 60, // Ancho predeterminado para otros markers
    height: 80, // Alto predeterminado para otros markers
    defaultWidth: 40, // Ancho personalizado para defaultPoints
    defaultHeight: 40, // Alto personalizado para defaultPoints
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
          <h3>Partir desde:</h3>
          <br />
          <select
            onChange={(e) => handleSelect(e, true)}
            style={{ width: "250px" }}
          >
            <option value="">Selecciona un punto de partida</option>
            <option value="currentLocation">Ubicación Actual</option>
            {buildings.map((building, index) => (
              <option key={index} value={building.name}>
                Edif. {building.no} "{building.name}"
              </option>
            ))}
          </select>
          <br />
          <br />
          <h3>Llegar hasta el Edificio:</h3>

          <br />
          <select
            onChange={(e) => handleSelect(e, false)}
            style={{ width: "250px" }}
          >
            <option value="">Selecciona un edificio de destino</option>
            {buildings.map((building, index) => (
              <option key={index} value={building.name}>
                Edif. {building.no} "{building.name}"
              </option>
            ))}
          </select>

          <br />
          <br />
          <button onClick={handleViewRoute}>Ir al Edificio</button>
          <br />
          <br />
          <button onClick={handleClearRoute}>Borrar Ruta</button>
          <br />
          <br />
          {isLoading ? (
            <div
              className="loading-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>Verificando tu sesión...</span>

              <ClipLoader color="#3d8463" loading={isLoading} size={30} />
            </div>
          ) : (
            directionsInstructions.length > 0 && (
              <div className="instrucciones">
                <h2>Instrucciones para llegar al edificio:</h2>
                <ol>
                  {directionsInstructions.map((instruction, index) => (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{ __html: instruction }}
                    />
                  ))}
                </ol>
              </div>
            )
          )}
        </div>
        <div className="map-content">
          <GoogleMap
            {...mapOptions}
            options={{
              mapId: "9ddcb7692f5e8d1",
              mapTypeControl: false, // Deshabilita el control de tipo de mapa
            }}
          >
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
                  url: defaultPoints.some(
                    (defaultBuilding) =>
                      defaultBuilding.latitude === building.latitude &&
                      defaultBuilding.longitude === building.longitude
                  )
                    ? EntradasMarker
                    : MarkerMi,
                  scaledSize: new window.google.maps.Size(
                    defaultPoints.some(
                      (defaultBuilding) =>
                        defaultBuilding.latitude === building.latitude &&
                        defaultBuilding.longitude === building.longitude
                    )
                      ? markerDimensions.defaultWidth
                      : markerDimensions.width,
                    defaultPoints.some(
                      (defaultBuilding) =>
                        defaultBuilding.latitude === building.latitude &&
                        defaultBuilding.longitude === building.longitude
                    )
                      ? markerDimensions.defaultHeight
                      : markerDimensions.height
                  ),
                  labelOrigin: new window.google.maps.Point(
                    defaultPoints.some(
                      (defaultBuilding) =>
                        defaultBuilding.latitude === building.latitude &&
                        defaultBuilding.longitude === building.longitude
                    )
                      ? markerDimensions.defaultWidth / 2
                      : markerDimensions.width / 2,
                    defaultPoints.some(
                      (defaultBuilding) =>
                        defaultBuilding.latitude === building.latitude &&
                        defaultBuilding.longitude === building.longitude
                    )
                      ? markerDimensions.defaultHeight + 20 // Ajusta según sea necesario
                      : markerDimensions.height + 20 // Ajusta según sea necesario
                  ),
                }}
                onClick={() => handleMarkerClick(building)}
                label={{
                  text:
                    building.name.length > 40
                      ? building.name.substring(0, 30) + "..."
                      : building.name,
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "20px",
                  backgroundColor: defaultPoints.some(
                    (defaultBuilding) =>
                      defaultBuilding.latitude === building.latitude &&
                      defaultBuilding.longitude === building.longitude
                  )
                    ? "orange"
                    : "aliceblue",
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
                  <div
                    className="infoContent"
                    styles={{
                      background: "red",
                      backgroundSize: "cover",
                    }}
                  >
                    <h2 style={{ fontSize: "18px" }}>
                      {selectedBuilding.name}
                    </h2>
                    <Carousel {...settings}>
                      {selectedBuilding.imageUrls.map((url, index) => (
                        <div key={index}>
                          <img
                            src={`${process.env.REACT_APP_SECURE_URL}${url}`}
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
                    <p>{selectedBuilding.description}</p>
                  </div>
                </InfoWindow>
              </div>
            )}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: MarkerMi,
                  scaledSize: new window.google.maps.Size(60, 80),
                  labelOrigin: new window.google.maps.Point(30, 85),
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

      <div className="descarga">
        <h3>
          No olvides descargar la versión completa de PoliPath exclusivamente
          para la Comunidad Politécnica
        </h3>
        <img src={PoliPath} alt="PoliPath" />

        <br />
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
