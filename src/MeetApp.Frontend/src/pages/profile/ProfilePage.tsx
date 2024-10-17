import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { Avatar } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import profileData from "../../json/Perfil.json";


interface RegisterForm {
  email: string;
  password: string;
  userType: string;
  city: string;
  profilePicture: string;
  bussinesName: string;
  bussinesAddress: string;
  bussinesCategory: string;
  cif: string;
  googleMapsUrl: string;
}

interface Profile {
    email: string;
    password: string;
    userType: string;
    city: string;
    profilePicture: string;
    bussinesName: string;
    bussinesAddress: string;
    bussinesCategory: string;
    cif: string;
    googleMapsUrl: string;
  }

export const ProfilePage = () => {
  const { t } = useTranslation("profilePage");
  const auth = useAuthUser();
  const [form] = Form.useForm<RegisterForm>();
  const [isCompany, setIsCompany] = useState(false);
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    setProfile(profileData);
  }, []);


  return (
    <div style={{ padding: "20px" }}>
      {/* <div style={{ position: "fixed", top: "100px", left: "100px", zIndex: 10 }} > */}
      <Divider orientation="center">Profile</Divider>
      <Row align="middle" justify="center">
        <Col flex="20%">
          <Avatar
            size={{ xs: 32, sm: 40, md: 64, lg: 80, xl: 100, xxl: 200 }}
            src="https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png"
          />
        </Col>
        <Divider
          type="vertical"
          style={{ borderColor: "#7cb305", height: "500px" }}
          orientation="right"
        ></Divider>
        <Col flex="auto">
          <div style={{ width: "80%" }}>
            <Form form={form} layout="vertical">
              <Form.Item label="Email" name="email">
                <Input variant="filled" placeholder={profile?.email} disabled/>
              </Form.Item>

              <Form.Item label="Ciudad" name="city">
              <Input variant="filled" placeholder={profile?.city} disabled/>
              </Form.Item>

              <Form.Item label="Foto de Perfil (URL)" name="profilePicture">
                <Input variant="filled" placeholder={profile?.profilePicture} disabled/>
              </Form.Item>
              <Form.Item label="userType" name="userType">
                <Input variant="filled" placeholder={profile?.userType} disabled/>
              </Form.Item>

              <Form.Item label="Nombre de la Empresa" name="bussinesName">
                <Input variant="filled" placeholder={profile?.bussinesName} disabled/>
              </Form.Item>

              <Form.Item label="Dirección de la Empresa" name="bussinesAddress">
                <Input variant="filled" placeholder={profile?.bussinesAddress} disabled/>
              </Form.Item>

              <Form.Item label="CIF de la Empresa" name="cif">
                <Input variant="filled" placeholder={profile?.cif} disabled/>
              </Form.Item>

              <Form.Item label="URL de Google Maps" name="googleMapsUrl">
                <Input variant="filled" placeholder={profile?.googleMapsUrl} disabled/>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      {/* </div> */}
    </div>
  );
};
