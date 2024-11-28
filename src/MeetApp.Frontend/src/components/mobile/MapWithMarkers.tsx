import React, { useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import {
  AddOutline,
  AntOutline,
  CalendarOutline,
  ClockCircleOutline,
  EnvironmentOutline,
  RightOutline,
  UserOutline,
} from "antd-mobile-icons";

interface MapWithMarkersProps {
  center: { lat: number; lng: number } | undefined;
  locations: ({ lat: number; lng: number } | undefined)[];
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({
  center,
  locations,
}) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const position = { lat: 40.73061, lng: -73.935242 };

  const [selectedLocation, setSelectedLocation] = useState<
    google.maps.LatLng | { lat: number; lng: number } | null
  >();

  return (
    <APIProvider apiKey="AIzaSyDtkRH-fJVpyyeHtsLJqkLowlS3Zot93ro">
      <Map
        defaultCenter={center}
        defaultZoom={15}
        mapId="DEMO_MAP_ID"
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        style={mapContainerStyle}
      >
        {locations &&
          locations.map((location, index) => (
            <AdvancedMarker key={index} position={location} />
          ))}
        <AdvancedMarker
          position={center}
          title={"Mi casa"}
          onClick={() => setSelectedLocation(center)}
        ></AdvancedMarker>
        {selectedLocation && (
          <InfoWindow
            headerContent={<h3>McDonald's Copa d'Or</h3>}
            position={selectedLocation} // Position the bubble at the marker's location
            onCloseClick={() => setSelectedLocation(null)} // Close the bubble when clicked
          >
            <div>
              <p>Lat: {selectedLocation.lat.toString()}</p>
              <p>Lng: {selectedLocation.lng.toString()}</p>
              <p>
                <ClockCircleOutline />
                <span>9:00h</span>
              </p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default MapWithMarkers;
