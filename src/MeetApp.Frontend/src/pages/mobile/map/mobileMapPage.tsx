import React, { RefObject, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMapPageStyles.css");

import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import MapWithMarkers from "../../../components/mobile/MapWithMarkers";
import CustomTimePicker from "../../../components/mobile/CustomTimePicker";
import CustomDatePicker from "../../../components/mobile/CustomDatePicker";
import { Button, DatePickerRef, PickerRef, Toast } from "antd-mobile";
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
import { BASE_URL } from "../../../configs/GeneralApiType";
import { use } from "i18next";

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const { t } = useTranslation(["mappage", "global"]);
  const user = useAuthUser()()?.user;
  const url = `${BASE_URL}/api/v1/activities`;

  const [timePickerVisible, setTimePickerVisible] = useState(false); // State to control the visibility of the Picker
  const [datePickerVisible, setDatePickerVisible] = useState(false); // State to control the visibility of the Picker
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // State to store the selected time
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State to store the selected date
  const [activities, setActivities] = useState<Activity[]>([]); // State to store the activities fetched from the API

  // Lista de puntos a marcar.
  const locations = [
    { lat: 40.73061, lng: -73.935242 }, // Ejemplo: Nueva York
    { lat: 34.052235, lng: -118.243683 }, // Ejemplo: Los Ángeles
    { lat: 41.878113, lng: -87.629799 }, // Ejemplo: Chicago
  ];

  interface Activity {
    id: string;
    offerId: string;
    ownerId: string;
    title: string;
    description: string;
    dateTime: string;
    peopleLimit: number;
    location: string;
    latitude: number;
    longitude: number;
  }

  const fetchActivity = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: Activity[] = await response.json();
        const validData = data.filter((activity) => {
          return activity.latitude && activity.longitude;
        });
        setActivities(validData);
        console.log(data);
      } else {
        Toast.show({ icon: "fail", content: "Error fetching activities" });
      }
    } catch (error) {
      Toast.show({ icon: "fail", content: "Error fetching activities" });
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

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
                <CalendarOutline className="icon" />
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
                <ClockCircleOutline className="icon" />
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
        {location && (
          <MapWithMarkers center={location} activities={activities} />
        )}
      </div>
      <div>
        {/* {location ? (
          <p>
            Your location: Latitude: {location.lat}, Longitude: {location.lng}
          </p>
        ) : (
          <p>Fetching location...</p>
        )} */}
      </div>
    </div>
  );
};

export default MapComponent;
