import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileRegisterPageStyles.css");

import React, { useState } from "react";
import { Button, Input, Form, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../configs/GeneralApiType";
import LogoLogin from "../../../img/logoWithWhiteLetters.png";


interface RegisterForm {
  name: string;
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

const MobileRegisterPage: React.FC = () => {
  const [form] = Form.useForm<RegisterForm>();
  const navigate = useNavigate();
  const { t } = useTranslation("registerpage");
  const url = `${BASE_URL}/api/v1/users/registration`;

  const validateNoWhitespace = (_: any, value: string) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error());
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values: RegisterForm) => {
    try {
      values.userType = "Student";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        Toast.show({ icon: "success", content: t("register_success") });
        navigate("/login");
      } else if (response.status === 400) {
        const errorData = await response.json();
        Toast.show({
          icon: "fail",
          content: errorData.message || "Solicitud inválida, cosa de camps.",
        });
      } else {
        Toast.show({
          icon: "fail",
          content: "Error en el servidor",
        });
      }
    } catch (error) {
      Toast.show({
        icon: "fail",
        content: "Error en el registro",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-container" style={{ padding: "16px" }}>
      <div className="logo">
        <img src={LogoLogin} alt="Logo" />
      </div>
      <h2>{t("title")}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        footer={
          <Button block type="submit" color="primary" size="large">
            {t("register_button")}
          </Button>
        }
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
          className="form-item"
        >
          <Input className="form-input" placeholder={t("name")} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
          className="form-item"
        >
          <Input className="form-input" placeholder={t("email")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
          className="form-item"
        >
          <Input
            type="password"
            className="form-input"
            placeholder={t("password")}
          />
        </Form.Item>

        <Form.Item
          name="city"
          rules={[
            { required: true, message: "Por favor ingrese su ciudad!" },
            { validator: validateNoWhitespace },
          ]}
        >
          <Input className="form-input" placeholder={t("city")} />
        </Form.Item>

        <Form.Item
          name="profilePicture"
          rules={[
            {
              required: true,
              message: "Por favor ingrese la URL de su foto de perfil!",
            },
          ]}
          className="form-item"
        >
          <Input className="form-input" placeholder={t("profile_picture")} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default MobileRegisterPage;
