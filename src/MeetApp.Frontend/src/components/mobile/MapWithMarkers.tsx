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
import { Button, Divider } from "antd-mobile";
import dayjs from "dayjs";
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
    height: "400px",
  };

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>();

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
            headerContent={<h3 style={{minWidth:"50vw"}}>{selectedActivity.title}</h3>}
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
              <Divider/>
              <p>
                <UserOutline />
                <span>0/{selectedActivity.peopleLimit}</span>
              </p>
              <p>
                <EnvironmentOutline />
                <span>{selectedActivity.location}</span>
              </p>
              <p>
                <ClockCircleOutline />
                <span>{dayjs(selectedActivity.dateTime).format("HH:mm")}</span>
              </p>
              <p>
                <Button color="primary" className="activity-join-button">
                  Join
                </Button>
              </p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default MapWithMarkers;
