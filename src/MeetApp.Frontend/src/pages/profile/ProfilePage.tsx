import React, { useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import { Col, Divider, Form, Input, Row, Avatar, Button } from "antd";
import "./profilePage.css";
import { profile } from "console";

interface RegisterForm {
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
}

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
}

export const ProfilePage = () => {
  const { t } = useTranslation("profilepage");
  const user = useAuthUser()()?.user;
  const [form] = Form.useForm<RegisterForm>();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>(
    user?.profilePicture
  );

  const handleEdit = () => {
    setIsEditing(!isEditing);
    // if (isEditing) {
    //   form.resetFields();
    // }
  };

  const handleSave = () => {
    // form.submit();
    // form.resetFields();
    setProfilePicture(form.getFieldValue("profilePicture"));
    console.log("save");
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    form.resetFields();
    setProfilePicture(user?.profilePicture);
    console.log("cancel");
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    console.log("delete");
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
                onClick={isEditing ? handleSave : handleEdit}
              >
                {isEditing ? t("save_button") : t("edit_button")}
              </Button>
              <Button
                className="profile-button"
                color="danger"
                variant={isEditing ? "outlined" : "solid"}
                onClick={isEditing ? handleCancel : handleDelete}
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

              <Form.Item
                label={t("cif")}
                name="businessCif"
                initialValue={user?.cif}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t("business_address")}
                name="businessAdress"
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
      {/* </div> */}
    </div>
  );
};
