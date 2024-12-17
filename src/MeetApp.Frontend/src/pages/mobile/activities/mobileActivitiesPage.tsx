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
  Stepper,
} from "antd-mobile";
import { useNavigate } from "react-router-dom";
import {
  AddOutline,
  AntOutline,
  CalendarOutline,
  ClockCircleOutline,
  EditSOutline,
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
  location: string;
  latitude: number;
  longitude: number;
}

interface ActivityForm {
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

const ActivitiesMobilePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const { t } = useTranslation(["activitiespage", "global"]);
  const user = useAuthUser()()?.user;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();
  const url = `${BASE_URL}/api/v1/activity`;

  const dateFormatTemp = t("global:date_format");
  const timeFormatTemp = t("global:time_format");
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

  const getCoordinates = async (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDtkRH-fJVpyyeHtsLJqkLowlS3Zot93ro`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        message.error(t("An error occurred while fetching location"));
        return null;
      }
    } catch (err) {
      message.error(t("An error occurred while fetching location"));
      return null;
    }
  };

  const handleCreateActivity = async (values: ActivityForm) => {
    const location = await getCoordinates(values.location);

    if (!location) {
      message.error("Error fetching location of the activity");
      return;
    }

    const activityData = {
      ...values,
      ownerId: user.id,
      latitude: location.lat,
      longitude: location.lng,
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

  const items = filteredActivities.map((activity, index) => {
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
              <div>
                <EnvironmentOutline />
                <span>{activity.location}</span>
              </div>
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
              {t("global:join")}
            </Button>
          </div>
        </Card>
      </div>
    );
  });

  const joinActivityModal = () => {
    return (
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
    );
  };

  useEffect(() => {
    const filtered = activities.filter(
      (activity) =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [searchTerm, activities]);

  const createActivityModal = () => {
    return (
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
          <Form
            form={form}
            layout="horizontal"
            mode="card"
            onFinish={handleCreateActivity}
            footer={
              <>
                <Button block type="submit" color="primary" size="large">
                  {t("global:publish")}
                </Button>
              </>
            }
          >
            <Form.Item
              name="title"
              rules={[{ required: true, message: "" }]}
              label={<EditSOutline />}
            >
              <Input
                placeholder={t("global:title")}
                name="title"
                // onChange={(value) => {
                //   setUsername(value);
                // }}
                // className="form-input"
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
              <TextArea
                placeholder={t("global:description")}
                maxLength={100}
                rows={2}
                showCount
                className="form-input"
              />
            </Form.Item>
            <Form.Item
              name="location"
              rules={[{ required: true, message: "" }]}
              label={<EnvironmentOutline />}
            >
              <Input placeholder={t("global:location")} name="location" />
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
                cancelText={t("global:cancel")}
                confirmText={t("global:confirm")}
              >
                {(value) =>
                  value
                    ? dayjs(value).format(dateFormat + " " + timeFormat)
                    : ""
                }
              </DatePicker>
            </Form.Item>

            <Form.Item
              initialValue={2}
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
              name="peopleLimit"
              label={<UserOutline />}
            >
              <Stepper min={2}/>
            </Form.Item>
          </Form>
        }
      />
    );
  };

  return (
    <div className="activities-container">
      <div className="search-bar">
        <SearchBar
          placeholder={t("search_placeholder")}
          onChange={(value) => setSearchTerm(value)}
        />
        <Button color="primary" onClick={() => setIsFormModalVisible(true)}>
          <AddOutline />
        </Button>
      </div>
      <Divider />
      <div className="scroll">
        <div className="card-activities">{items}</div>
      </div>
      {isModalVisible && joinActivityModal()}
      <div className="create-activity-modal">
        {isFormModalVisible && createActivityModal()}
      </div>
    </div>
  );
};

export default ActivitiesMobilePage;
