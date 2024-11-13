import { isMobile } from 'react-device-detect';
if (isMobile) import ("./MainMobileLayout.css");
import React, { useEffect, useState } from "react";

import { Avatar, Popover, TabBar, Space, Button, Radio } from "antd-mobile";
import { AppOutline, UnorderedListOutline, PieOutline } from "antd-mobile-icons";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import i18n from "../../../i18n";

interface MobileMainLayoutProps {
  children: React.ReactNode;
}

const MobileMainLayout: React.FC<MobileMainLayoutProps> = ({ children }) => {
  const { t } = useTranslation("layout");
  const user = useAuthUser()()?.user;
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("es");

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };


  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
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
        <Popover
          content={
            <div style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
              <Button onClick={() => navigate("/profile")}>{t("profile")}</Button>
              <div style={{ marginTop: "10px" }}>
                <span>{t("language")}: </span>
                <Radio.Group value={language} onChange={(val) => handleLanguageChange(val as string)}>
                  <Radio value="es">
                    <ReactCountryFlag countryCode="ES" svg />
                  </Radio>
                  <Radio value="en">
                    <ReactCountryFlag countryCode="US" svg />
                  </Radio>
                  <Radio value="ba">
                    <ReactCountryFlag countryCode="BA" svg />
                  </Radio>
                </Radio.Group>
              </div>
              <Button onClick={handleLogout} style={{ marginTop: "10px" }}>
                {t("logout")}
              </Button>
            </div>
          }
          trigger="click"
        >
          <Avatar
            src={user?.profilePicture}
            style={{ "--size": "48px", "--border-radius": "50%" }}
          />
        </Popover>
      </div>

      <div className="mobile-content">{children}</div>

      <div className="tabbar-container">
        <TabBar onChange={(key) => navigate(key)}>
          <TabBar.Item key="/" icon={<AppOutline />} title={t("home")} />
          <TabBar.Item key="/activities" icon={<UnorderedListOutline />} title="Activities" />
          <TabBar.Item key="/stats" icon={<PieOutline />} title={t("stats")} />
        </TabBar>
      </div>
    </div>
  );
};

export default MobileMainLayout;
