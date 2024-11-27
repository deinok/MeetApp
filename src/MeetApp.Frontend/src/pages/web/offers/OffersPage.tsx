import { isDesktop } from 'react-device-detect';
if (isDesktop) import ("./offersPage.css");

import PlaceHolderImg from "../../../img/placeholder300x300.png";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Divider,
  message,
  Modal,
  Tag,
  Tooltip,
  Form,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { AddActivityForm } from "./components/AddActivityForm";
import { EditOfferForm } from "./components/EditOfferForm";
import { BASE_URL } from "../../../configs/GeneralApiType";

interface Offer {
  id: string;
  bussinesId: string;
  title: string;
  description: string;
  expirationDate: string;
  tag: string;
}

export const OffersPage = () => {
  const { t } = useTranslation("offerspage");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [form] = Form.useForm();

  const url = `${BASE_URL}/api/v1/offers`;

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

  const handleEditCancel = () => {
    form.resetFields();
    setEditVisible(false);
    setEditingOffer(null);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setEditVisible(true);
    form.setFieldsValue({
      title: offer.title,
      description: offer.description,
      expirationDate: dayjs(offer.expirationDate),
      tag: offer.tag,
    });
  };

  const onCreditCardClick = (offerId: string) => {};

  const handleDeleteOffer = async (id: string) => {
    Modal.confirm({
      title: t("offer_delete_message"),
      onOk: async () => {
        try {
          const deleteUrl = `${url}/${id}`;
          const response = await fetch(deleteUrl, {
            method: "DELETE",
          });
          if (response.ok) {
            message.success(t("offer_delete_success"));
            setOffers((prevOffers) =>
              prevOffers.filter((offer) => offer.id !== id)
            );
            setFilteredOffers((prevFiltered) =>
              prevFiltered.filter((offer) => offer.id !== id)
            );
          } else {
            message.error(t("offer_delete_fail"));
          }
        } catch (error) {
          console.error("Error deleting offer:", error);
          message.error(t("offer_delete_error"));
        }
      },
    });
  };

  const submitEdit = async (values: any) => {
    if (!editingOffer) return;

    try {
      const editUrl = `${url}/${editingOffer.id}`;
      const response = await fetch(editUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          expirationDate: values.expirationDate.format("YYYY-MM-DD"),
          tag: values.tag,
        }),
      });

      if (response.ok) {
        message.success(t("Offer updated successfully"));

        const updatedOffer = {
          ...editingOffer,
          title: values.title,
          description: values.description,
          expirationDate: values.expirationDate.format("YYYY-MM-DD"),
          tag: values.tag,
        };

        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === updatedOffer.id ? updatedOffer : offer
          )
        );
        setFilteredOffers((prevFiltered) =>
          prevFiltered.map((offer) =>
            offer.id === updatedOffer.id ? updatedOffer : offer
          )
        );

        handleEditCancel();
      } else {
        message.error(t("Failed to update offer"));
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      message.error(t("An error occurred while updating the offer"));
    }
  };

  const isExpired = (expirationDate: string) => {
    return dayjs(expirationDate).isBefore(dayjs(), "day");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Divider orientation="left">
        <h1>{t("title")}</h1>
      </Divider>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Input
          placeholder={t("search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "300px", minWidth: "300px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
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

      <Modal
        title={t("edit_offer")}
        onCancel={handleEditCancel}
        footer={null}
        centered
        open={editVisible}
        style={{ width: "500px" }}
        maskClosable={false}
      >
        {editingOffer && (
          <EditOfferForm
            offer={editingOffer}
            onSubmit={submitEdit}
            onCancel={handleEditCancel}
            t={t}
            form={form}
          />
        )}
      </Modal>

      <div className="offers-container">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => {
            const expired = isExpired(offer.expirationDate);
            return (
              <div
                className={`card-container ${expired ? "expired" : "valid"}`}
                key={offer.id}
              >
                <Card
                  className="offer-card"
                  key={offer.id}
                  cover={<img alt={offer.title} src={PlaceHolderImg} />}
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={() => handleEditOffer(offer)}
                    />,
                    <CreditCardOutlined key="credit-card" onClick={()=> onCreditCardClick(offer.id) } />,
                    <DeleteOutlined
                      key="delete"
                      className="delete-button"
                      onClick={() => handleDeleteOffer(offer.id)}
                    />,
                  ]}
                >
                  <Tooltip
                    title={expired ? t("offer_expired") : t("offer_valid")}
                  >
                    {expired ? (
                      <CloseCircleOutlined
                        className="offer-state-icon expired-icon"
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          color: "red",
                          fontSize: "24px",
                          zIndex: 100,
                        }}
                      />
                    ) : (
                      <CheckCircleOutlined
                        className="offer-state-icon valid-icon"
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          color: "green",
                          fontSize: "24px",
                          zIndex: 100,
                        }}
                      />
                    )}
                  </Tooltip>
                  <Tag color="#34638a" className="overlay-tag">
                    {offer.tag}
                  </Tag>
                  <Card.Meta
                    title={offer.title}
                    description={offer.description}
                  />
                  <p style={{ marginTop: "40px", marginBottom: "-10px" }}>
                    <ClockCircleOutlined style={{ marginRight: "10px" }} />
                    {t("available_until", {
                      expiration_date: dayjs(offer.expirationDate).format(
                        t("date_format")
                      ),
                    })}
                  </p>
                </Card>
              </div>
            );
          })
        ) : (
          <p>{t("No offers found")}</p>
        )}
      </div>
    </div>
  );
};
