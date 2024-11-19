import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileActivitiesPageStyles.css");

import React, { useEffect, useState, RefObject } from "react";
import {
  Card,
  Modal,
  SearchBar,
  Button,
  Divider,
  Input,
  Form,
  DatePicker,
  TextArea,
} from "antd-mobile";
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
import { useAuthUser } from "react-auth-kit";
import { BASE_URL } from "../../../configs/GeneralApiType";
import message from "antd/es/message";
import type { DatePickerRef } from "antd-mobile/es/components/date-picker";

interface Activity {
  id: string;
  offerId: string;
  ownerId: string;
  title: string;
  description: string;
  dateTime: string;
  peopleLimit: number;
}

interface ActivityForm {
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
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const { t } = useTranslation("activitiespage");
  const user = useAuthUser()()?.user;
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();
  const url = `${BASE_URL}/api/v1/activity`;

  const dateFormatTemp = t("date_format");
  const timeFormatTemp = t("time_format");
  const dateFormat =
    dateFormatTemp != "date_format" ? dateFormatTemp : "YYYY-MM-DD";
  const timeFormat = timeFormatTemp != "time_format" ? timeFormatTemp : "HH:mm";

  const [form] = Form.useForm<ActivityForm>();

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

  const handleCreateActivity = async (values: ActivityForm) => {
    const activityData = {
      ...values,
      ownerId: user.id,
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
        setActivities((prevActivities) => [...prevActivities, createdActivity]);
        message.success("Activity created successfully");
        setIsFormModalVisible(false);
      } else {
        message.error("Error creating activity");
      }
    } catch (error) {
      message.error("Error creating activity");
    }
  };

  const handleFormInputChange = (
    field: keyof Activity,
    value: string | number
  ) => {
    setNewActivity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalVisible(true);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    activity: Activity
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(activity);
    }
  };

  const handlerOpenModal = (activity: Activity) => {
    setIsModalVisible(true);
    setSelectedActivity(activity);
  };

  const handleConfirmJoin = (activity: Activity) => {
    setIsModalVisible(false);
    navigate(`/chat/${activity.id}`);
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
  console.log(selectedActivity, "selectedActivity id here");

  const items = activities.map((activity, index) => {
    const { date, time } = processDateTime(activity.dateTime);
    return (
      <div
        className="card"
        key={activity.id}
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
            </div>
            <Button
              color="primary"
              onClick={() => {
                handlerOpenModal(activity);
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
          content={t("join_activity_message", {
            name: selectedActivity?.title,
          })}
          closeOnMaskClick={true}
          onClose={handleCancel}
          actions={[
            { key: "no", text: t("no"), onClick: handleCancel },
            {
              key: "yes",
              text: t("yes"),
              onClick: () => handleConfirmJoin(selectedActivity!),
            },
          ]}
        />
      )}

      {isFormModalVisible && (
        <div className="create-activity-modal">
          <Modal
            visible={isFormModalVisible}
            closeOnMaskClick={true}
            onClose={() => setIsFormModalVisible(false)}
            title={t("create_activity")}
            style={{
              width: "100%", // Custom width
              maxWidth: "500px", // Optional max width for responsiveness
            }}
            content={
              <>
                <Form
                  form={form}
                  layout="horizontal"
                  mode="card"
                  onFinish={handleCreateActivity}
                  footer={
                    <>
                      <Button block type="submit" color="primary" size="large">
                        {t("create_button")}
                      </Button>
                    </>
                  }
                >
                  <Form.Item
                    name="title"
                    rules={[{ required: true, message: "" }]}
                  >
                    <Input
                      placeholder={t("activity_title")}
                      name="title"
                      // onChange={(value) => {
                      //   setUsername(value);
                      // }}
                      className="form-input"
                    />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    {/* <Input
                      placeholder={t("activity_description")}
                      name="description"
                      // onChange={(value) => {
                      //   setPassword(value);
                      // }}
                      className="form-input"
                    /> */}
                    <TextArea
                      placeholder={t("activity_description")}
                      maxLength={100}
                      rows={2}
                      showCount
                      className="form-input"
                    />
                  </Form.Item>
                  <Form.Item
                    name="dateTime"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                    trigger="onConfirm"
                    onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                      datePickerRef.current?.open();
                    }}
                    label={<CalendarOutline />}
                  >
                    <DatePicker
                      precision="minute"
                      cancelText={t("cancel_date")}
                      confirmText={t("confirm_date")}
                    >
                      {(value) =>
                        value
                          ? dayjs(value).format(dateFormat + " " + timeFormat)
                          : ""
                      }
                    </DatePicker>
                    {/* <Input
                    type="datetime-local"
                    placeholder={t("activity_datetime")}
                    name="dateTime"
                    // onChange={(value) => {
                    //   setPassword(value);
                    // }}
                    className="form-input"
                  /> */}
                  </Form.Item>
                  <Form.Item
                    name="peopleLimit"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder={t("activity_people")}
                      name="peopleLimit"
                      // onChange={(value) => {
                      //   setPassword(value);
                      // }}
                      className="form-input"
                    />
                  </Form.Item>
                </Form>
              </>

              // <div>
              //   <h3></h3>
              //   <div className="input-group">
              //     <Input
              //       placeholder={t("activity_title")}
              //       onChange={(value) => handleFormInputChange("title", value)}
              //     />
              //   </div>
              //   <div className="input-group">
              //     <Input
              //       placeholder={t("activity_description")}
              //       onChange={(value) =>
              //         handleFormInputChange("description", value)
              //       }
              //     />
              //   </div>
              //   <div className="input-group">
              //     <Input
              //       type="datetime-local"
              //       placeholder={t("activity_datetime")}
              //       onChange={(value) => handleFormInputChange("dateTime", value)}
              //     />
              //   </div>
              //   <div className="input-group">
              //     <Input
              //       type="number"
              //       placeholder={t("activity_people_limit")}
              //       onChange={(value) =>
              //         handleFormInputChange("peopleLimit", Number(value))
              //       }
              //     />
              //   </div>
              //   <button className="submit-button" onClick={handleCreateActivity}>
              //     {t("create_button")}
              //   </button>
              // </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ActivitiesMobilePage;
