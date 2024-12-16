import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMainPageStyles.css");

import React, { useEffect, useState } from "react";
import { Card, Tag } from "antd-mobile";
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
import { BASE_URL } from "../../../configs/GeneralApiType";

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

interface Business {
  businessId: string;
  businessName: string;
  profilePicture: string;
  businessAddress: string;
  latitude: number;
  longitude: number;
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
  const url = `${BASE_URL}/api/v1/offers`;
  const urlBusinesses = `${BASE_URL}/api/v1/users/businesses`;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Map<string, Business>>();

  const fetchOffers = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: Offer[] = await response.json();
        setOffers(data);
        // setFilteredOffers(data);
      } else {
        Toast.show({ icon: "fail", content: t("Failed to fetch offers") });
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      Toast.show({
        icon: "fail",
        content: t("An error occurred while fetching offers"),
      });
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(urlBusinesses);
      if (response.ok) {
        const data: Business[] = await response.json();
        const map: Map<string, Business> = new Map();
        console.log("Data fetched:", data);
        data.forEach((business) => {
          map.set(business.businessId, business);
        });
        setBusinesses(map);
        console.log("Businesses fetched:", map);
      } else {
        Toast.show({ icon: "fail", content: t("Failed to fetch businesses") });
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      Toast.show({
        icon: "fail",
        content: t("An error occurred while fetching businesses"),
      });
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const offersCards = offers.map((offer, index) => {
    return businesses && businesses.get(offer.bussinesId) && (
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
              <Avatar src={businesses.get(offer.bussinesId)?.profilePicture ?? ""} />
            </div>
          }
          // onBodyClick={onBodyClick}
          // onHeaderClick={onHeaderClick}
          style={{ borderRadius: "16px" }}
        >
          <div className="overlay-tag">
            <Tag round color="#34638a">
              {offer.tag}
            </Tag>
          </div>
          <div className="card-content">
            <p>{offer.description}</p>
          </div>
          <div className="card-footer">
            <div className="date-container">
              <div>
                <CalendarOutline />
                <span>
                  {dayjs(offer.expirationDate).format(t("global:date_format"))}
                </span>
              </div>
            </div>
            <div className="buttons-container"></div>
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
      <h3>{t("available_offers")}</h3>
      <div className="filter-container">
        <Dropdown>
          <Dropdown.Item key="sorter" title="Empresa">
            <div style={{ padding: 12 }}>
              <Radio.Group defaultValue="default">
                <Space direction="vertical" block>
                  {businesses && [...businesses.values()].map((business) => (
                    <Radio key={business.id} value={business.id}>
                      {business.businessName}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="scroll">
        <div className="offers-container">{offersCards}</div>
      </div>
    </div>
  );
};

export default MobileMainPage;
