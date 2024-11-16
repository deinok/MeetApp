// src/LoginPage.jsx
import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileLoginPageStyles.css");
import React, { useState } from "react";
import { Button, Divider, Form, Input, Toast } from "antd-mobile";
import LogoLogin from "../../../img/logoWithWhiteLetters.png";
import { useTranslation } from "react-i18next";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../configs/GeneralApiType";

const LoginPage = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const url = `${BASE_URL}/api/v1/users/token`;
  const { t } = useTranslation("loginpage");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: username,
          password: password,
        }).toString(),
      });

      const data = await response.json();

      if (response.ok && data.access_token && data.user.userType == "Student") {
        signIn({
          token: data.access_token,
          expiresIn: data.expires_inm || 6000,
          tokenType: data.token_type,
          authState: { user: data.user },
        });
        Toast.show({ icon: "success", content: t("login_success") });
        navigate("/");
      } else {
        throw new Error(data.error_description || t("invalid_credentials"));
      }
    } catch (error) {
      Toast.show({
        icon: "fail",
        content: (error as Error).message || t("login_error"),
      });
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={LogoLogin} alt="Logo" />
      </div>
      <h2>Iniciar sesión</h2>

      <Form
        layout="horizontal"
        mode="card"
        onFinish={handleSubmit}
        footer={
          <>
            <Button block type="submit" color="primary" size="large">
              {t("login_button")}
            </Button>
            <Divider> {t("or")} </Divider>
            <Button onClick={() => navigate("/register")} block style={{height: "50px"}}>
              {t("register_button")}
            </Button>
          </>
        }
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Por favor, ingresa tu correo" }]}
        >
          <Input
            placeholder="Correo electrónico"
            type="email"
            name="username"
            onChange={(value) => {
              setUsername(value);
            }}
            className="form-input"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Por favor, ingresa tu contraseña" },
          ]}
        >
          <Input
            placeholder="Contraseña"
            type="password"
            name="password"
            onChange={(value) => {
              setPassword(value);
            }}
            className="form-input"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
