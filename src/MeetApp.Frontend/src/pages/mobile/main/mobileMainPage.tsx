import { isMobile } from "react-device-detect";
if (isMobile) import("./mobileMainPageStyles.css");

import React, { useEffect, useRef, useState } from "react";
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
  const [offers, setOffers] = useState<Map<string, Offer[]>>();
  const [businesses, setBusinesses] = useState<Map<string, Business>>();
  const [filteredOffers, setFilteredOffers] = useState<Map<string, Offer[]>>();

  const dropdownRef = useRef<{ close: () => void }>(null); // Create a ref with 'close' method access

  const handleClose = () => {
    dropdownRef.current?.close(); // Call the close method exposed by the Dropdown
  };
  const [businessSelectedName, setBusinessSelectedName] = useState<string>();

  const fetchOffers = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: Offer[] = await response.json();
        const offerMap = new Map<string, Offer[]>();

        data.forEach((offer) => {
          const { bussinesId } = offer;

          // Check if the businessId already exists in the Map
          if (!offerMap.has(bussinesId)) {
            offerMap.set(bussinesId, []); // Initialize an empty array for new keys
          }

          // Add the offer to the corresponding businessId array
          offerMap.get(bussinesId)?.push(offer);
        });
        setOffers(offerMap);
        console.log("Offers fetched:", offerMap);
        setFilteredOffers(offerMap);
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

  const buildSwiperItems = (offers: Offer[]) => {
    return offers.map((offer) => {
      return (
        <Swiper.Item key={offer.id}>
          <div
            className="swiper-item"
            key={offer.id}
            // onClick={() => handleCardClick(activity.name)}
            // onKeyDown={(event) => handleCardKeyDown(event, activity.name)}
            tabIndex={0}
            role="button"
          >
            <div className="card">
              <div className="overlay-tag">
                <Tag round color="#34638a">
                  {offer.tag}
                </Tag>
              </div>
              <Card
                className="card-element"
                title={<div className="card-title">{offer.title}</div>}
                extra={
                  <div>
                    <Avatar
                      src={
                        businesses?.get(offer.bussinesId)?.profilePicture ?? ""
                      }
                    />
                  </div>
                }
                // onBodyClick={onBodyClick}
                // onHeaderClick={onHeaderClick}
              >
                <div className="card-content">
                  <p>{offer.description}</p>
                </div>
                <div className="card-footer">
                  <div className="date-container">
                    <div>
                      <CalendarOutline />
                      <span>
                        {dayjs(offer.expirationDate).format(
                          t("global:date_format")
                        )}
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
                    {t("Crear Actividad")}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Swiper.Item>
      );
    });
  };

  const buildOfferSwipers = (offersMap: Map<string, Offer[]>) => {
    return (
      offersMap &&
      businesses &&
      [...offersMap.entries()].map(([businessId, offersList]) => {
        return (
          <>
            {!businessSelectedName && (
              <h3>{businesses?.get(businessId)?.businessName}</h3>
            )}
            <div key={businessId} className="business-offers">
              <Swiper
                slideSize={90}
                trackOffset={5}
                stuckAtBoundary={false}
                total={offersList.length}
                // indicator={true}
                // defaultIndex={2}
                style={{
                  "--track-padding": " 0 0 5px",
                }}
              >
                {buildSwiperItems(offersList)}
              </Swiper>
            </div>
          </>
        );
      })
    );
  };

  const handleBusinessSelection = (key: any) => {
    const selectedBusinessId = key;
    if (selectedBusinessId === "default") {
      setFilteredOffers(offers);
    } else {
      const selectedBusinessOffers = offers?.get(selectedBusinessId);
      setFilteredOffers(
        new Map([[selectedBusinessId!, selectedBusinessOffers!]])
      );
    }
    setBusinessSelectedName(businesses?.get(selectedBusinessId)?.businessName);
    handleClose();
  };

  const buildBusinessSelect = () => {
    return (
      <Radio.Group defaultValue="default" onChange={handleBusinessSelection}>
        <Space direction="vertical" block>
          <Radio value="default">{t("All")}</Radio>
          {businesses &&
            [...businesses.entries()].map(([id, business]) => (
              <Radio key={id} value={id}>
                {business.businessName}
              </Radio>
            ))}
        </Space>
      </Radio.Group>
    );
  };

  return (
    <div className="main-container">
      <div className="greeting-container">
        <h1>
          {t("greeting")}, <p>{user.name}</p>
        </h1>
      </div>
      <Divider />
      <h2>{t("available_offers")}</h2>
      <div className="filter-container">
        <Dropdown ref={dropdownRef}>
          <Dropdown.Item key="sorter" title={businessSelectedName ?? t("all")}>
            <div style={{ padding: 12 }}>{buildBusinessSelect()}</div>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="scroll">
        <div className="offers-container">
          {buildOfferSwipers(filteredOffers!)}
        </div>
      </div>
    </div>
  );
};

export default MobileMainPage;
