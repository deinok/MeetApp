import { isMobile } from "react-device-detect";
if (isMobile) import("./MainMobileLayout.css");
import React, { useEffect, useState } from "react";
import { Avatar, Popover, TabBar, Button, Radio } from "antd-mobile";
import {
  UnorderedListOutline,
  MessageOutline,
} from "antd-mobile-icons";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import i18n from "../../../i18n";
import LogoLogin from "../../../img/logoWithWhiteLetters.png";

interface MobileMainLayoutProps {
  children: React.ReactNode;
}

const MobileMainLayout: React.FC<MobileMainLayoutProps> = ({ children }) => {
  const { t } = useTranslation("layout");
  const user = useAuthUser()()?.user;
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);
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

  useEffect(() => {
    // Update active tab when the location changes
    setActiveKey(location.pathname);
  }, [location]);

  return (
    <div className="mobile-layout">
      <div className="mobile-header">
        {(location.pathname !== "/" && (
          <div className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
          </div>
        )) || <img src={LogoLogin} alt="Logo" className="logo" />}

        <Popover
          content={
            <div className="user-popover"
              style={{
                padding: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button onClick={() => navigate("/profile")}>
                {t("profile")}
              </Button>
              <div className= "languages">
                <Radio.Group
                  value={language}
                  onChange={(val) => handleLanguageChange(val as string)}
                >
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
        <TabBar
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key); // Update active tab state
            navigate(key); // Navigate to the selected tab
          }}
        >
          <TabBar.Item key="/" icon={<HomeOutlined />} title={t("home_section")} />
          <TabBar.Item
            key="/activities"
            icon={<UnorderedListOutline />}
            title={t("activities_section")}
          />
          <TabBar.Item
            key=""
            icon={<MessageOutline />}
            title={t("chats_section")}
          />
          {/* <TabBar.Item
            key="/profile"
            icon={<UserOutline />}
            title={t("profile")}
          /> */}
        </TabBar>
      </div>
    </div>
  );
};

export default MobileMainLayout;
