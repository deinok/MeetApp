import { isDesktop } from 'react-device-detect';
if (isDesktop) import ("./MainLayoutStyles.css");

import LogoLogin from "../../../img/logoWithWhiteLetters.png";
import React from "react";
import { Layout, Dropdown, Avatar, Divider } from "antd";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../../../components/LanguageSelector";

const { Header, Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useTranslation("layout");
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const user = auth()?.user;

  const handleLogout = () => {
    sessionStorage.clear();
    signOut();
    navigate("/login");
  };

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
          <LanguageSelector />
        </div>
      ),
    },
    {
      key: "logout",
      label: (
        <a href="/login" onClick={handleLogout}>
          {t("logout")}
        </a>
      ),
    },
  ];

  return (
    <Layout className="layout-container">
      <Header className="app-header">
        <div className="header-left">
          <button onClick={handleLogoClick} className="logo-button">
            <img src={LogoLogin} alt="Logo" className="logo" />
          </button>
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
