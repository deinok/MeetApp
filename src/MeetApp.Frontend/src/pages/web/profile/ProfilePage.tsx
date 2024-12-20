import { isDesktop } from "react-device-detect";
if (isDesktop) import("./profilePage.css");

import React, { useState } from "react";
import { useSignOut } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import {
  Col,
  Divider,
  Form,
  Input,
  Row,
  Avatar,
  Button,
  Modal,
  message,
} from "antd";
import { BASE_URL } from "../../../configs/GeneralApiType";
import { useNavigate } from "react-router-dom";
import { loadUserFromSession } from "../utilities";

const url = `${BASE_URL}/api/v1/users/businessUpdate`;
interface Profile {
  email: string;
  password: string;
  userType: string;
  city: string;
  profilePicture: string;
  businessName: string;
  businessAddress: string;
  businessCategory: string;
  cif: string;
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
}

export const ProfilePage = () => {
  const { t } = useTranslation("profilepage");
  const [user, setUser] = useState(loadUserFromSession());
  const [form] = Form.useForm<Profile>();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>(
    user?.profilePicture
  );
  const [locationCoordinates, setLocationCoordinates] = useState({
    lat: user?.latitude,
    lng: user?.longitude,
  });
  const currentBusinessAddress = user?.bussinesAddress;
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

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

  const updateProfile = async (values: Profile) => {
    const editUrl = `${url}/${user.id}`;
    const response = await fetch(editUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessName: values.businessName,
        email: values.email,
        city: values.city,
        profilePicture: values.profilePicture,
        cif: values.cif,
        businessAddress: values.businessAddress,
        googleMapsUrl: values.googleMapsUrl,
        latitude: locationCoordinates.lat,
        longitude: locationCoordinates.lng,
      }),
    });

    if (response.ok) {
      const updatedUser = {
        id: user.id,
        bussinesName: values.businessName,
        email: values.email,
        city: values.city,
        profilePicture: values.profilePicture,
        cif: values.cif,
        bussinesAddress: values.businessAddress,
        googleMapsUrl: values.googleMapsUrl,
        latitude: locationCoordinates.lat,
        longitude: locationCoordinates.lng,
      };
      console.log("Updated user:", updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      message.success(t("Profile updated successfully"));
    } else {
      message.error(t("Failed to update profile"));
    }
  };

  const handleSave = async (values: Profile) => {
    console.log(values.businessAddress, currentBusinessAddress);
    if (values.businessAddress != currentBusinessAddress) {
      const result = await getCoordinates(values.businessAddress);
      if (result) {
        setLocationCoordinates(result);
      }
    }
    await updateProfile(values);
    setIsEditing(!isEditing);
    navigate("/profile");
  };

  const handleCancel = () => {
    form.resetFields();
    setProfilePicture(user?.profilePicture);
    console.log("cancel");
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t("account_delete_message"),
      okText: t("accept_delete_account_button"), // Custom text for OK button
      cancelText: t("cancel_delete_account_button"), // Custom text for Cancel button
      onOk: async () => {
        handleLogout();
        // try {
        //   const deleteUrl = `${url}/${id}`;
        //   const response = await fetch(deleteUrl, {
        //     method: "DELETE",
        //   });
        //   if (response.ok) {
        //     handleLogout();
        //   } else {
        //     message.error(t("account_delete_fail"));
        //   }
        // } catch (error) {
        //   console.error("Error deleting offer:", error);
        //   message.error(t("account_delete_error"));
        // }
      },
    });
  };

  const handleOnChangeProfilePicture = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfilePicture(e.target.value);
  };

  return (
    <div className="profileContainer">
      {/* <div style={{ position: "fixed", top: "100px", left: "100px", zIndex: 10 }} > */}
      <Divider orientation="center">
        <h1>{t("title")}</h1>
      </Divider>
      <Row className="row-container" gutter={[16, 16]}>
        <Col
          xs={24} // Tamaño completo en pantallas pequeñas (móvil)
          md={4} // 6 columnas en pantallas más grandes
          className="profile-col"
        >
          <div className="profile-photo">
            <Avatar
              size={{ xs: 150, sm: 150, md: 100, lg: 120, xl: 140, xxl: 200 }}
              src={profilePicture}
              className="avatar-size"
            />
            <div className="button-group">
              <Button
                type="primary"
                className="profile-button"
                style={{ margin: 0 }}
                onClick={
                  isEditing
                    ? (e) => handleSave(form.getFieldsValue())
                    : handleEdit
                }
              >
                {isEditing ? t("save_button") : t("edit_button")}
              </Button>
              <Button
                className="profile-button"
                color="danger"
                variant={isEditing ? "outlined" : "solid"}
                onClick={
                  isEditing ? handleCancel : () => handleDelete(user?.id)
                }
              >
                {isEditing ? t("cancel_button") : t("delete_button")}
              </Button>
            </div>
          </div>
        </Col>
        <Col
          xs={24}
          md={20} // Aproximadamente 80% en pantallas grandes
          className="info-col"
        >
          <div className="info-fields">
            <Form form={form} layout="vertical" disabled={!isEditing}>
              <Form.Item
                label={t("business_name")}
                name="businessName"
                initialValue={user?.bussinesName}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t("email")}
                name="email"
                initialValue={user?.email}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t("city")}
                name="city"
                initialValue={user?.city}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t("profile_picture")}
                name="profilePicture"
                initialValue={user?.profilePicture}
              >
                <Input onChange={handleOnChangeProfilePicture} />
              </Form.Item>

              <Form.Item label={t("cif")} name="cif" initialValue={user?.cif}>
                <Input />
              </Form.Item>

              <Form.Item
                label={t("business_address")}
                name="businessAddress"
                initialValue={user?.bussinesAddress}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t("google_maps_url")}
                name="googleMapsUrl"
                initialValue={user?.googleMapsUrl}
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};
