import "./MainMobileLayout.css";
import React, { useEffect, useState } from "react";
import { Avatar, Popover, TabBar, Space, Button } from "antd-mobile";
import { AppOutline, UnorderedListOutline, PieOutline } from "antd-mobile-icons";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import i18n from "../../i18n";

interface MobileMainLayoutProps {
  children: React.ReactNode;
}

const MobileMainLayout: React.FC<MobileMainLayoutProps> = ({ children }) => {
  const { t } = useTranslation("layout");
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("es");

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    i18n.changeLanguage(value);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <div className="mobile-layout">
      <div className="mobile-header">
        <Popover.Menu
          actions={[
            { key: "profile", text: t("profile"), icon: <AppOutline />, onClick: () => navigate("/profile") },
            {
              key: "language",
              text: t("language"),
              icon: <ReactCountryFlag countryCode={language === "es" ? "ES" : language === "en" ? "US" : "BA"} svg />,
              onClick: () => {}
            },
            { key: "logout", text: t("logout"), icon: <UnorderedListOutline />, onClick: handleLogout }
          ]}
          trigger="click"
        >
          <Avatar
            src="https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png"
            style={{ "--size": "48px", "--border-radius": "50%" }}
          />
        </Popover.Menu>

        <Popover
          content={
            <Space direction="vertical">
              <Button onClick={() => handleLanguageChange("es")}>
                <ReactCountryFlag countryCode="ES" svg /> 
              </Button>
              <Button onClick={() => handleLanguageChange("en")}>
                <ReactCountryFlag countryCode="US" svg /> 
              </Button>
              <Button onClick={() => handleLanguageChange("ba")}>
                <ReactCountryFlag countryCode="BA" svg /> 
              </Button>
            </Space>
          }
          trigger="click"
          placement="bottomRight"
        >
          <Button>{t("language")}</Button>
        </Popover>
      </div>

      <div className="mobile-content">{children}</div>

      <div className="tabbar-container">
        <TabBar onChange={(key) => navigate(key)}>
          <TabBar.Item key="/home" icon={<AppOutline />} title={t("home")} />
          <TabBar.Item key="/offers" icon={<UnorderedListOutline />} title={t("offers")} />
          <TabBar.Item key="/stats" icon={<PieOutline />} title={t("stats")} />
        </TabBar>
      </div>
    </div>
  );
};

export default MobileMainLayout;
