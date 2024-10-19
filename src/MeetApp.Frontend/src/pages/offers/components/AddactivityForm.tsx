import React from "react";
import { Form, Input, Button, DatePicker, message, Select } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs"; 

import type { DatePickerProps } from "antd";
import { useAuthUser } from "react-auth-kit";

interface AddActivityFormProps {
  onClose: () => void; 
}

export const AddActivityForm: React.FC<AddActivityFormProps> = ({ onClose }) => {
  const { t } = useTranslation("mainpage");
  const auth = useAuthUser();
  const user = auth();
  

  const url = "https://localhost:5001/api/v1/offers";

  const handleSubmit = async (values: any) => {
    const data = {
      bussinesId: user?.user.id, 
      title: values.offer_title,
      description: values.offer_desc,
      expirationDate: dayjs(values.expiration_date).format("YYYY-MM-DD"),
      tag: values.offer_tag, 
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data) 
      });

      if (response.ok) {
        message.success(t("Offer successfully created"));
        onClose(); 
        window.location.reload();
      } else {
        message.error(t("Failed to create offer"));
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      message.error(t("An error occurred while creating the offer"));
    }
  };

  const onChangeCalendar: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const { TextArea } = Input;

  const onChangeDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("Change:", e.target.value);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="offer_title"
        label={t("offer_title")}
        rules={[{ required: true, message: t("Please enter the name") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="offer_desc"
        label={t("offer_desc")}
        rules={[{ required: true, message: t("Please enter the details") }]}
      >
        <TextArea
          showCount
          maxLength={100}
          onChange={onChangeDesc}
          placeholder=""
          style={{ height: 120, resize: "none" }}
        />
      </Form.Item>

      <Form.Item
        name="expiration_date"
        label={t("expiration_date")}
        rules={[{ required: true, message: t("Please enter the date") }]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          onChange={onChangeCalendar}
          placeholder=""
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="offer_tag"
        label={t("Tag")}
        rules={[{ required: true, message: t("Please enter or select a tag") }]}
      >
        <Input placeholder={t("Enter a tag")} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("publish_button")}
        </Button>
        <Button
          type="default"
          onClick={onClose}
          style={{ marginLeft: "8px" }}
        >
          {t("cancel_button")}
        </Button>
      </Form.Item>
    </Form>
  );
};
