// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { DivIcon } from 'leaflet';
// import Logo from '../../assets/Logo.png'
// import 'leaflet/dist/leaflet.css';

// const MapComponent = () => {
//   const position = [-0.212258, -78.490368];  
//   const position2 = [-0.212258, -78.489190];

//   const imgIcon = new DivIcon({
//     html: `<img src='../../assets/Logo.png' />`,
//     iconSize: [30, 30] // Ajusta el tamaño según necesites
//   });

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <MapContainer center={position2} zoom={17} style={{ height: "70vh", width: "50%", borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <Marker position={position} icon={imgIcon}>
//           <Popup>
//             Entrada Teatro Politécnico
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// }

// export default MapComponent;



import React from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import credential from '../Administrador/credential';

const MapContainer = () => {

const mapStyles = {        
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', "width":'80vh'};
  
  const defaultCenter = {
    lat: -0.210075, lng: -78.489190
  }

  const [searchBox, setSearchBox] = React.useState(null);
  const onPlacesChanged = () => {
    console.log(searchBox.getPlaces());
  }

  const location = {
    lat: -0.212258, lng: -78.490368
  }
  
  return (
     <LoadScript
       googleMapsApiKey={credential.mapsKey}
       libraries={["places"]}>
       <StandaloneSearchBox
         onLoad={ref => setSearchBox(ref)}
         onPlacesChanged={onPlacesChanged}>
         <input
           type="text"
           placeholder="Buscar lugar"
           style={{
             boxSizing: `border-box`,
             border: `1px solid transparent`,
             width: `240px`,
             height: `32px`,
             padding: `0 12px`,
             borderRadius: `3px`,
             boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
             fontSize: `14px`,
             outline: `none`,
             textOverflow: `ellipses`,
             position: "absolute",
             left: "5%",
             top: "10px"
           }}
         />
       </StandaloneSearchBox>
       <GoogleMap
         mapContainerStyle={mapStyles}
         zoom={17}
         center={defaultCenter}>
         <Marker
           position={location}
           title="Entrada Teatro Politécnico"
         />
       </GoogleMap>
     </LoadScript>
  )
}

export default MapContainer;




