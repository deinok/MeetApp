import "./MainLayoutStyles.css";
import LogoLogin from "../img/logoWithWhiteLetters.png";
import React, { useEffect, useState } from "react";
import {
  Layout,
  Dropdown,
  Avatar,
  Divider,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import ReactCountryFlag from "react-country-flag";

const { Header, Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useTranslation("layout");
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("es");

  const user = auth()?.user;

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const handleLanguageChange = (e: RadioChangeEvent) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  // Retrieve language from localStorage when the component mounts
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const items = [
    {
      key: "profile",
      label: <a href="/profile">{t("profile")}</a>,
    },
    {
      key: "language",
      label: (
        <div>
          <span>{t("language")}: </span>
          <Radio.Group value={language} onChange={handleLanguageChange}>
            <Radio.Button value="es">
              <ReactCountryFlag countryCode="ES" svg />
            </Radio.Button>
            <Radio.Button value="en">
              <ReactCountryFlag countryCode="US" svg />
            </Radio.Button>
            <Radio.Button value="ba">
              <ReactCountryFlag countryCode="BA" svg />
            </Radio.Button>
          </Radio.Group>
          {/* <Switch
            checked={language === "en"}
            onChange={handleLanguageChange}
            checkedChildren="EN"
            unCheckedChildren="ES"
          /> */}
        </div>
      ),
    },
    {
      key: "logout",
      label: <a onClick={handleLogout}>{t("logout")}</a>,
    },
  ];

  return (
    <Layout className="layout-container">
      <Header className="app-header">
        <div className="header-left">
          <a onClick={handleLogoClick} className="logo-link">
            <img src={LogoLogin} alt="Logo" className="logo" />
          </a>
          <Divider type="vertical" className="custom-divider" />
          <div className="headers-links">
            <a href="/offers">{t("offers_section")}</a>
            <a href="/stats">{t("stats_section")}</a>
          </div>
        </div>
        <div className="header-right">
          <p className="email-text">{user?.email || "correo@ejemplo.com"}</p>
          <Divider type="vertical" className="custom-divider" />
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Avatar
              src="https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png"
              size="large"
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Content className="app-content">{children}</Content>
      </Layout>
      <Footer className="app-footer">
        <p>{t("copyright")}</p>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
