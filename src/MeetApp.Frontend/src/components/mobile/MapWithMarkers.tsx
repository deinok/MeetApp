import React, { useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";

import {
  ClockCircleOutline,
  EnvironmentOutline,
  UserOutline,
} from "antd-mobile-icons";
import { isMobile } from "react-device-detect";
import { Button, Divider, Modal } from "antd-mobile";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
isMobile && import("./MapWithMarkersStyles.css");

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

interface MapWithMarkersProps {
  center: { lat: number; lng: number } | undefined;
  activities: Activity[];
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({
  center,
  activities,
}) => {
  const mapContainerStyle = { 
    width: "100%",
    height: "calc(100vh - 280px)"
  };

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation(["mappage", "global"]);
  const navigate = useNavigate();

  const joinActivityModal = () => {
    return (
      <Modal
        visible={isModalVisible}
        content={t("global:join_message", {
          name: selectedActivity?.title,
        })}
        closeOnMaskClick={true}
        onClose={handleCancel}
        actions={[
          { key: "no", text: t("global:no"), onClick: handleCancel },
          {
            key: "yes",
            text: t("global:yes"),
            onClick: () => handleConfirmJoin(selectedActivity!),
          },
        ]}
      />
    );
  };

  const handleConfirmJoin = (activity: Activity) => {
    setIsModalVisible(false);
    navigate(`/chat/${activity.id}`);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOpenGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedActivity?.latitude},${selectedActivity?.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

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
        <AdvancedMarker position={center}>
          <Pin
            background={"#0f9d58"}
            borderColor={"#006425"}
            glyphColor={"#60d98f"}
          />
        </AdvancedMarker>
        {activities &&
          activities.map((activity, index) => (
            <AdvancedMarker
              key={index}
              position={{ lat: activity.latitude, lng: activity.longitude }}
              onClick={() => setSelectedActivity(activity)}
            />
          ))}

        {selectedActivity && (
          <InfoWindow
            headerContent={
              <h3 style={{ minWidth: "50vw" }}>{selectedActivity.title}</h3>
            }
            position={{
              lat: selectedActivity.latitude,
              lng: selectedActivity.longitude,
            }} // Position the bubble at the marker's location
            onCloseClick={() => setSelectedActivity(null)} // Close the bubble when clicked
          >
            <div className="activity-marker-window">
              <p>
                <span>{selectedActivity.description}</span>
              </p>
              <Divider />
              <p>
                <UserOutline />
                <span>0/{selectedActivity.peopleLimit}</span>
              </p>
              <p>
                <EnvironmentOutline />
                <span><a onClick={handleOpenGoogleMaps}>{selectedActivity.location}</a></span>
              </p>
              <p>
                <ClockCircleOutline />
                <span>{dayjs(selectedActivity.dateTime).format("HH:mm")}</span>
              </p>
              <p>
                <Button color="primary" className="activity-join-button" onClick={() => setIsModalVisible(true)}>
                  {t("global:join")}
                </Button>
              </p>
            </div>
          </InfoWindow>
        )}
        {isModalVisible && joinActivityModal()}
      </Map>
    </APIProvider>
  );
};

export default MapWithMarkers;
