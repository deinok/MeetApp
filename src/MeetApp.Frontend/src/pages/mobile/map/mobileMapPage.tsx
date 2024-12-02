import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMapPageStyles.css");

import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import MapWithMarkers from "../../../components/mobile/MapWithMarkers";

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const { t } = useTranslation("mappage");
  const user = useAuthUser()()?.user;

  const center = { lat: 40.73061, lng: -73.935242 }; // Coordenadas del centro del mapa.

  // Lista de puntos a marcar.
  const locations = [
    { lat: 40.73061, lng: -73.935242 }, // Ejemplo: Nueva York
    { lat: 34.052235, lng: -118.243683 }, // Ejemplo: Los Ángeles
    { lat: 41.878113, lng: -87.629799 }, // Ejemplo: Chicago
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge:  0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="map-conainer">
      <div>
        {location ? (
          <p>
            Your location: Latitude: {location.lat}, Longitude: {location.lng}
          </p>
        ) : (
          <p>Fetching location...</p>
        )}
      </div>
      <div>
        <h1>Google Maps con Múltiples Marcadores</h1>
        {location && <MapWithMarkers center={location} locations={locations} />}
      </div>
    </div>
  );
};

export default MapComponent;
