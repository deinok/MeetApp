import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileActivitiesPageStyles.css");

import React, { useState } from "react";
import activities from "./activites.json";
import { Card, Modal, SearchBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "antd-mobile";
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
import { Divider } from "antd";
import { useAuthUser } from "react-auth-kit";

const ActivitiesMobilePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("activitiespage");
  const user = useAuthUser()()?.user;

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

  const handleConfirmJoin = () => {
    setIsModalVisible(false);
    navigate("/chat");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const processDateTime = (datetime: string) => {
    const date = dayjs(datetime).format("DD/MM/YYYY"); // Get date
    const time = dayjs(datetime).format("HH:mm"); // Get time
    console.log(user.id);
    return { date, time };
  };

  const empresesjson = activities;
  const items = empresesjson.map((activity, index) => {
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
              {activity.offerId && (
                <div>
                  <EnvironmentOutline />
                  <span></span>
                </div>
              )}
              <div>
                <CalendarOutline />
                <span>{date}</span>
              </div>
              <div>
                <ClockCircleOutline />
                <span>{time}</span>
              </div>
            </div>
            <div className="buttons-container">
              {/* {user.id == activity.ownerId && (
                <>
                  <Button
                    color="danger"
                    onClick={() => {
                      // Toast.show("点击了底部按钮");
                    }}
                  >
                    {t("delete_button")}
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => {
                      // Toast.show("点击了底部按钮");
                    }}
                  >
                    {t("edit_button")}
                  </Button>
                </>
              )} */}
              <Button
                color="primary"
                onClick={() => {
                  // Toast.show("点击了底部按钮");
                }}
              >
                {t("join_button")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  });

  return (
    <div className="activities-container">
      <div className="search-bar">
        <SearchBar placeholder={t("search_placeholder")} />
        <Button color="primary">
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
    </div>
  );
};

export default ActivitiesMobilePage;
