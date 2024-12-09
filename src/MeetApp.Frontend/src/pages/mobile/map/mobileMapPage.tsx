import React, { RefObject, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMapPageStyles.css");

import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import MapWithMarkers from "../../../components/mobile/MapWithMarkers";
import CustomTimePicker from "../../../components/mobile/CustomTimePicker";
import CustomDatePicker from "../../../components/mobile/CustomDatePicker";
import { Button, DatePickerRef, PickerRef } from "antd-mobile";
import dayjs from "dayjs";
import {
  AddOutline,
  AntOutline,
  CalendarOutline,
  ClockCircleOutline,
  EnvironmentOutline,
  RightOutline,
  UserOutline,
} from "antd-mobile-icons";

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const { t } = useTranslation(["mappage", "global"]);
  const user = useAuthUser()()?.user;

  const center = { lat: 40.73061, lng: -73.935242 }; // Coordenadas del centro del mapa.

  const [timePickerVisible, setTimePickerVisible] = useState(false); // State to control the visibility of the Picker
  const [datePickerVisible, setDatePickerVisible] = useState(false); // State to control the visibility of the Picker
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // State to store the selected time
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State to store the selected date

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
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="map-conainer">
      <div>
        <div className="map-filters">
          <div className="filter">
            {/* <span>Fecha:</span> */}
            <Button onClick={() => setDatePickerVisible(true)}>
              <div className="button-content">
                <CalendarOutline className="icon"/>
                <span className="value">{selectedDate}</span>
              </div>
            </Button>
            <CustomDatePicker
              visible={datePickerVisible}
              setVisibleHandler={setDatePickerVisible}
              onChange={(value) => setSelectedDate(value)}
              defaultValue={dayjs().format(t("global:date_format"))}
            />
          </div>
          <div className="filter">
            {/* <span>Desde:</span> */}
            <Button onClick={() => setTimePickerVisible(true)}>
              <div className="button-content">
                <ClockCircleOutline className="icon"/>
                <span className="value">{selectedTime} </span>
              </div>
            </Button>
            <CustomTimePicker
              visible={timePickerVisible}
              setVisibleHandler={setTimePickerVisible}
              onChange={(value) => setSelectedTime(value)}
              defaultValue={dayjs().format("HH:mm")}
            />
          </div>
        </div>
        {location && <MapWithMarkers center={location} locations={locations} />}
      </div>
      <div>
        {location ? (
          <p>
            Your location: Latitude: {location.lat}, Longitude: {location.lng}
          </p>
        ) : (
          <p>Fetching location...</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
