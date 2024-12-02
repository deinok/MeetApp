import React, { useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";

import { ClockCircleOutline, EnvironmentOutline, UserOutline } from "antd-mobile-icons";
import { isMobile } from "react-device-detect";
import { Button } from "antd";
isMobile && import("./MapWithMarkersStyles.css");

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
        <AdvancedMarker
          position={center}
          title={"Mi casa"}
          onClick={() => setSelectedLocation(center)}
        >
          <Pin
            background={"#0f9d58"}
            borderColor={"#006425"}
            glyphColor={"#60d98f"}
          />
        </AdvancedMarker>
        {locations &&
          locations.map((location, index) => (
            <AdvancedMarker key={index} position={location} />
          ))}

        {selectedLocation && (
          <InfoWindow
            headerContent={<h3>Title</h3>}
            position={selectedLocation} // Position the bubble at the marker's location
            onCloseClick={() => setSelectedLocation(null)} // Close the bubble when clicked
          >
            <div className="activity-marker-window">
              <p>
                <UserOutline /> 
                <span>0/5</span>
              </p>
              <p>
                  <EnvironmentOutline />
                  <span>Location</span>
                </p>
              <p>
                <ClockCircleOutline />
                <span>9:00h</span>
              </p>
              <p>
                Click to see more details...
              </p>
              <p>
              <Button type="primary" className="activity-join-button">Join</Button>
              </p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default MapWithMarkers;
