import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMainPageStyles.css");

import React, { useState } from "react";
import { Card } from "antd-mobile";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import {
  Swiper,
  Toast,
  Image,
  Radio,
  Space,
  Dropdown,
  Button,
  Avatar,
} from "antd-mobile";
import empreses from "./empresesColab.json";
import McDonaldsPicture from "../../../img/McDonalds-logo2.png";
import BurgerKingPicture from "../../../img/Burger_King_2020.svg.png";
import TelepizzaPicture from "../../../img/logo-Ibai.png";
import DominosPicture from "../../../img/logo-domino-s-pizza.jpg";
import {
  AddOutline,
  AntOutline,
  CalendarOutline,
  ClockCircleOutline,
  EnvironmentOutline,
  RightOutline,
  UserOutline,
} from "antd-mobile-icons";
import { Divider } from "antd";
import dayjs from "dayjs";

const empresesPictures = [
  McDonaldsPicture,
  BurgerKingPicture,
  TelepizzaPicture,
  DominosPicture,
];

interface Offer {
  id: string;
  bussinesId: string;
  title: string;
  description: string;
  expirationDate: string;
  paid: boolean;
  tag: string;
}

const MobileMainPage: React.FC = () => {
  const { t } = useTranslation(["mainpage", "global"]);
  const user = useAuthUser()()?.user;
  const empresesjson = empreses;
  const items = empresesPictures.map((empresa, index) => (
    <Swiper.Item key={index}>
      <div className="business-picture">
        <Image src={empresa} width={100} height={100} fit="cover" />
      </div>
    </Swiper.Item>
  ));
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      bussinesId: "1",
      title: "Oferta 1",
      description: "Descripción de la oferta 1",
      expirationDate: "2022-12-31",
      paid: false,
      tag: "50%",
    },
    {
      id: "2",
      bussinesId: "2",
      title: "Oferta 2",
      description: "Descripción de la oferta 2",
      expirationDate: "2022-12-31",
      paid: false,
      tag: "2x1",
    },
    {
      id: "3",
      bussinesId: "3",
      title: "Oferta 3",
      description: "Descripción de la oferta 3",
      expirationDate: "2022-12-31",
      paid: false,
      tag: "3x2",
    },
    {
      id: "4",
      bussinesId: "4",
      title: "Oferta 4",
      description: "Descripción de la oferta 4",
      expirationDate: "2022-12-31",
      paid: false,
      tag: "5x1",
    },
  ]);

  const offersCards = offers.map((offer, index) => {
    return (
      <div
        className="card"
        key={offer.id}
        // onClick={() => handleCardClick(activity.name)}
        // onKeyDown={(event) => handleCardKeyDown(event, activity.name)}
        tabIndex={0}
        role="button"
      >
        <Card
          title={<div className="card-title">{offer.title}</div>}
          extra={
            <div>
              <Avatar src={McDonaldsPicture} />
            </div>
          }
          // onBodyClick={onBodyClick}
          // onHeaderClick={onHeaderClick}
          style={{ borderRadius: "16px" }}
        >
          <div className="card-content">
            <p>{offer.description}</p>
          </div>
          <div className="card-footer">
            <div className="date-container">
              <div>
                <CalendarOutline />
                <span>{dayjs(offer.expirationDate).format(t("global:date_format"))}</span>
              </div>
            </div>
            <div className="buttons-container">
            </div>
            <Button
              color="primary"
              onClick={() => {
                // handlerOpenModal(activity);
              }}
            >
              {t("use_button")}
            </Button>
          </div>
        </Card>
      </div>
    );
  });

  return (
    <div className="main-container">
      <div className="greeting-container">
        <h1>
          {t("greeting")}, <p>{user.name}</p>
        </h1>
      </div>
      <Divider />
      {/* <div className="business-pictures">
        <Swiper loop autoplay>
          {items}
        </Swiper>
      </div> */}
      <h3>{t("available_offers")}</h3>
      <div className="filter-container">
        <Dropdown>
          <Dropdown.Item key="sorter" title="Empresa">
            <div style={{ padding: 12 }}>
              <Radio.Group defaultValue="default">
                <Space direction="vertical" block>
                  <Radio block value="default">
                    McDonalds Copa D'or
                  </Radio>
                  <Radio block value="nearest">
                    Domino's Pizza
                  </Radio>
                  <Radio block value="top-rated">
                    Burger King
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="offers-container">{offersCards}</div>
    </div>
  );
};

export default MobileMainPage;
