import { isDesktop } from 'react-device-detect';
import LogoLogin from "../../../img/logoWithWhiteLetters.png";
import React, { useState } from "react";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import { BASE_URL } from "../../../configs/GeneralApiType";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../../../components/LanguageSelector";

if (isDesktop) import ("./LoginPage.css");

const { Title } = Typography;

export const LoginPage = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const url = `${BASE_URL}/api/v1/users/token`;
  const { t } = useTranslation("loginpage");

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: credentials.username,
          password: credentials.password,
        }).toString(),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        signIn({
          token: data.access_token,
          expiresIn: data.expires_inm || 6000,
          tokenType: data.token_type,
          authState: { user: data.user },
        });

        message.success(t("login_success"));
        navigate("/");
      } else {
        throw new Error(data.error_description || t("invalid_credentials"));
      }
    } catch (error) {
      message.error((error as Error).message || t("login_error"));
    }
  };

  return (
    <div className="container">
      <div className="banner">
        <img className="logoLogin" src={LogoLogin} alt="logo" />
        <LanguageSelector />
      </div>
      <div className="loginPagecontainer">
        <div className="login-container">
          <Title level={2}>{t("title")}</Title>
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label={t("user_label")}
              name="username"
              rules={[{ required: true, message: t("user_required") }]}
            >
              <Input name="username" onChange={handleChange} />
            </Form.Item>
            <Form.Item
              label={t("password_label")}
              name="password"
              rules={[{ required: true, message: t("password_required") }]}
            >
              <Input.Password name="password" onChange={handleChange} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("login_button")}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => navigate("/register")} block>
                {t("register_link")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
