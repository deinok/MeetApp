import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMainPageStyles.css");

import React from "react";
import { Layout, Divider, Card, Steps } from "antd";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import { Swiper, Toast, Image } from "antd-mobile";
import empreses from "./empresesColab.json";
import McDonaldsPicture from "../../../img/McDonalds-logo2.png";
import BurgerKingPicture from "../../../img/Burger_King_2020.svg.png";
import TelepizzaPicture from "../../../img/logo-Ibai.png";
import DominosPicture from "../../../img/logo-domino-s-pizza.jpg";

const empresesPictures = [
  McDonaldsPicture,
  BurgerKingPicture,
  TelepizzaPicture,
  DominosPicture,
];

const MobileMainPage: React.FC = () => {
  const { t } = useTranslation("mainpage");
  const user = useAuthUser()()?.user;
  const empresesjson = empreses;
  const items = empresesPictures.map((empresa, index) => (
    <Swiper.Item key={index}>
      <div className="business-picture">
        <Image src={empresa} width={100} height={100} fit="cover" />
      </div>
    </Swiper.Item>
  ));
  return (
    <div className="main-container">
      <div className="greeting-container">
        <h1>
          {t("greeting")}, <p>{user.name}</p>
        </h1>
      </div>
      <div className="business-pictures">
        <Swiper loop autoplay>
          {items}
        </Swiper>
      </div>
      <div></div>
    </div>
  );
};

export default MobileMainPage;
