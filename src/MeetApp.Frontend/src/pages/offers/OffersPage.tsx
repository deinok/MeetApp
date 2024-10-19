import React, { useEffect, useState } from "react";
import { Button, Card, Input, Divider, message, Modal, Tag } from "antd";
import { useAuthUser } from "react-auth-kit";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { AddActivityForm } from "./components/AddactivityForm";
import "./offersPage.css";

interface Offer {
  id: string;
  bussinesId: string;
  title: string;
  description: string;
  expirationDate: string;
  tag: string;
}

export const OffersPage = () => {
  const { t } = useTranslation("mainpage");
  const auth = useAuthUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [visible, setVisible] = useState(false);

  const user = auth()?.user;

  const url = "https://localhost:5001/api/v1/offers";

  const fetchOffers = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: Offer[] = await response.json();
        setOffers(data);
        setFilteredOffers(data);
      } else {
        message.error(t("Failed to fetch offers"));
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      message.error(t("An error occurred while fetching offers"));
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    const filtered = offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOffers(filtered);
  }, [searchTerm, offers]);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Divider orientation="left">
        <h1>{t("title")}</h1>
      </Divider>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Input
          placeholder="Buscar por título o fecha"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "300px", minWidth: "300px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{ margin: 0 }}
        />
      </div>

      <Modal
        title={t("add_offer")}
        onCancel={handleCancel}
        footer={null}
        centered
        open={visible}
        style={{ width: "500px" }}
        maskClosable={false}
      >
        <AddActivityForm onClose={handleCancel} />
      </Modal>

      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
          placeItems: "center",
        }}
      >
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div className="card-container">
              <Tag color="#34638a" className="overlay-tag">
                {offer.tag}
              </Tag>
              <Card
                className="offer-card"
                key={offer.id}
                style={{ width: 300 }}
                cover={
                  <img
                    alt={offer.title}
                    src="https://via.placeholder.com/300"
                  />
                }
                actions={[
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="delete" className="delete-button" />,
                ]}
              >
                <Card.Meta
                  title={offer.title}
                  description={offer.description}
                />
                <p>
                  {t("available_until", {
                    expiration_date: dayjs(offer.expirationDate).format(t("date_format")),
                  })}
                </p>  
              </Card>
            </div>
          ))
        ) : (
          <p>{t("No offers found")}</p>
        )}
      </div>
    </div>
  );
};
