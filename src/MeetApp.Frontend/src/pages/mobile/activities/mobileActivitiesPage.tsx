import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileActivitiesPageStyles.css");

import React, { useEffect, useState } from "react";
import { Card, Modal, SearchBar, Button, Divider, Input } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import {
  AddOutline,
  AntOutline,
  CalendarOutline,
  ClockCircleOutline,
  EnvironmentOutline,
  RightOutline,
  UserOutline,
} from "antd-mobile-icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../configs/GeneralApiType";
import message from "antd/es/message";
import { useAuthUser } from "react-auth-kit";

interface Activity {
  offerId: string;
  ownerId: string;
  title: string;
  description: string;
  dateTime: string;
  peopleLimit: number;
}

const ActivitiesMobilePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false); 
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({}); 
  const { t } = useTranslation("activitiespage");
  const [activities, setActivities] = useState<Activity[]>([]); 
  const navigate = useNavigate();
  const url = `${BASE_URL}/api/v1/activity`;
  const auth = useAuthUser();
  const user = auth()?.user;
  const userId = user.id; 

  const fetchActivity = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: Activity[] = await response.json();
        setActivities(data);
      } else {
        message.error("Error fetching activities");
      }
    } catch (error) {
      message.error("Error fetching activities");
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const handleCreateActivity = async () => {
    const activityData = {
      ...newActivity,
      ownerId: userId,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        const createdActivity: Activity = await response.json();
        setActivities((prevActivities) => [...prevActivities, createdActivity]); // Agregar la nueva actividad al estado
        message.success("Activity created successfully");
        setIsFormModalVisible(false); // Cierra el modal después de crear la actividad
      } else {
        message.error("Error creating activity");
      }
    } catch (error) {
      message.error("Error creating activity");
    }
  };

  const handleFormInputChange = (field: keyof Activity, value: string | number) => {
    setNewActivity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardClick = (activityName: string) => {
    setSelectedActivity(activityName);
    setIsModalVisible(true);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    activityName: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(activityName);
    }
  };


  const handlerOpenModal = () => {
    setIsModalVisible(true);
  };
  
  //passar activityId: string com a paràmetre
  const handleConfirmJoin = () => {
    setIsModalVisible(false);
    // navigate(`/chat/${activityId}`);
    navigate("/chat");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const processDateTime = (datetime: string) => {
    const date = dayjs(datetime).format("DD/MM/YYYY"); // Get date
    const time = dayjs(datetime).format("HH:mm"); // Get time
    return { date, time };
  };

  const items = activities.map((activity, index) => { // Mapear activities directamente
    const { date, time } = processDateTime(activity.dateTime);
    return (
      <div
        className="card"
        key={index}
        // onClick={() => handleCardClick(activity.name)}
        // onKeyDown={(event) => handleCardKeyDown(event, activity.name)}
        tabIndex={0}
        role="button"
      >
        <Card
          title={<div className="card-title">{activity.title}</div>}
          extra={
            <div>
              <UserOutline /> 0/{activity.peopleLimit}
            </div>
          }
          // onBodyClick={onBodyClick}
          // onHeaderClick={onHeaderClick}
          style={{ borderRadius: "16px" }}
        >
          <div className="card-content">
            <p>{activity.description}</p>
          </div>
          <div className="card-footer">
            <div className="date-container">
              <div className="location">
                <EnvironmentOutline />
                <span>{t("location")}:</span>
              </div>
              <div className="date">
                <CalendarOutline />
                <span>
                  {t("date")}: {date}
                </span>
              </div>
              <div className="time">
                <ClockCircleOutline />
                <span>
                  {t("time")}: {time}
                </span>
              </div>
            </div>
            <Button
              color="primary"
              onClick={() => {
                handlerOpenModal();
              }}
            >
              {t("join_button")}
            </Button>
          </div>
        </Card>
      </div>
    );
  });

  return (
    <div className="activities-container">
      <div className="search-bar">
        <SearchBar placeholder={t("search_placeholder")} />
        <Button color="primary" onClick={() => setIsFormModalVisible(true)}>
          <AddOutline />
        </Button>
      </div>
      <Divider />
      <div className="card-activities">{items}</div>

      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          content={<p>¿Quieres unirte a {selectedActivity}?</p>}
          closeOnMaskClick={true}
          onClose={handleCancel}
          actions={[
            { key: "no", text: "No", onClick: handleCancel },
            { key: "yes", text: "Sí", onClick: handleConfirmJoin },
          ]}
        />
      )}

      {isFormModalVisible && (
        <Modal
          visible={isFormModalVisible}
          closeOnMaskClick={true}
          onClose={() => setIsFormModalVisible(false)}
          content={
            <div>
              <h3>{t("create_activity")}</h3>
              <div className="input-group">
                <Input
                  placeholder={t("activity_title")}
                  onChange={(value) => handleFormInputChange("title", value)}
                />
              </div>
              <div className="input-group">
                <Input
                  placeholder={t("activity_description")}
                  onChange={(value) => handleFormInputChange("description", value)}
                />
              </div>
              <div className="input-group">
                <Input
                  type="datetime-local"
                  placeholder={t("activity_datetime")}
                  onChange={(value) => handleFormInputChange("dateTime", value)}
                />
              </div>
              <div className="input-group">
                <Input
                  type="number"
                  placeholder={t("activity_people_limit")}
                  onChange={(value) => handleFormInputChange("peopleLimit", Number(value))}
                />
              </div>
              <button className="submit-button" onClick={handleCreateActivity}>
                {t("create_button")}
              </button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default ActivitiesMobilePage;
