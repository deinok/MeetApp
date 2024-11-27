import React, { useState } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

interface MapWithMarkersProps {
  center: { lat: number; lng: number } | undefined;
  locations: ({ lat: number; lng: number }| undefined)[];
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({center, locations}) => {

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const position = { lat: 40.73061, lng: -73.935242 };

  return (
    <APIProvider apiKey="AIzaSyCchSE1BJ0P4buMHg3vtg5L7YtWKgZKTrQ">
      <Map
        defaultCenter={center}
        defaultZoom={15}
        mapId="DEMO_MAP_ID"
        // gestureHandling={'greedy'}
        // disableDefaultUI={true}
        style={mapContainerStyle}
      >
        {locations && locations.map((location, index) => (
          <AdvancedMarker key={index} position={location} />
        ))}
      </Map>
    </APIProvider>
    // isLoaded && (
    //   <GoogleMap
    //     mapContainerStyle={mapContainerStyle}
    //     center={center}
    //     zoom={15}
    //   >
    //     {/* Renderizar marcadores */}
    //     {locations.map((location, index) => (
    //       <Marker key={index} position={location} />
    //     ))}
    //   </GoogleMap>
    // )
  );
};

export default MapWithMarkers;
