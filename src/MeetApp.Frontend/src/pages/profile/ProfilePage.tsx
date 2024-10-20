import React from "react";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import { Col, Divider, Form, Input, Row, Avatar } from "antd";
import "./profilePage.css";

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
              src="https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png"
              className="avatar-size"
            />
          </div>
        </Col>
        <Col
          xs={24}
          md={20} // Aproximadamente 80% en pantallas grandes
          className="info-col"
        >
          <div className="info-fields">
            <Form form={form} layout="vertical">
              <Form.Item label={t("business_name")} name="businessName">
                <Input
                  variant="filled"
                  placeholder={user?.bussinesName}
                  disabled
                />
              </Form.Item>
              <Form.Item label={t("email")} name="email">
                <Input variant="filled" placeholder={user?.email} disabled />
              </Form.Item>

              <Form.Item label={t("city")} name="city">
                <Input variant="filled" placeholder={user?.city} disabled />
              </Form.Item>

              <Form.Item label={t("profile_picture")} name="profilePicture">
                <Input
                  variant="filled"
                  placeholder={user?.profilePicture}
                  disabled
                />
              </Form.Item>

              <Form.Item label={t("cif")} name="businessCif">
                <Input variant="filled" placeholder={user?.cif} disabled />
              </Form.Item>

              <Form.Item label={t("business_address")} name="businessAdress">
                <Input
                  variant="filled"
                  placeholder={user?.bussinesAddress}
                  disabled
                />
              </Form.Item>

              <Form.Item label={t("google_maps_url")} name="googleMapsUrl">
                <Input
                  variant="filled"
                  placeholder={user?.googleMapsUrl}
                  disabled
                />
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      {/* </div> */}
    </div>
  );
};
